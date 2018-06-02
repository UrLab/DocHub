# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re
import os
from os.path import join
import itertools
import collections

from django.db import models
from django.contrib import auth
from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from django.conf import settings
import actstream
import users.identicon

from catalog.models import Course


class CustomUserManager(UserManager):
    PATTERN = re.compile('[\W_]+')

    def _create_user(self, netid, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        now = timezone.now()
        if not netid:
            raise ValueError('The given netid must be set')
        email = self.normalize_email(email)
        user = self.model(netid=netid, email=email, last_login=now, **extra_fields)
        if settings.IDENTICON:
            IDENTICON_SIZE = 120
            if not os.path.exists(join(settings.MEDIA_ROOT, "profile")):
                os.makedirs(join(settings.MEDIA_ROOT, "profile"))
            profile_path = join(settings.MEDIA_ROOT, "profile", "{}.png".format(netid))
            alpha_netid = self.PATTERN.sub('', netid)
            users.identicon.render_identicon(int(alpha_netid, 36), IDENTICON_SIZE / 3).save(profile_path)
            user.photo = 'png'
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, netid, email=None, password=None, **extra_fields):
        return self._create_user(netid, email, password, **extra_fields)

    def create_superuser(self, netid, email, password, **extra_fields):
        return self._create_user(netid, email, password, is_superuser=True, **extra_fields)


class BaseUser(AbstractBaseUser):
    class Meta:
        abstract = True

    # Those 4 methods are needed for the Django Admin
    def has_perms(self, perm_list, obj=None):
        return all(self.has_perm(perm, obj) for perm in perm_list)

    def has_module_perms(self, module):
        for backend in auth.get_backends():
            if not hasattr(backend, 'has_module_perms'):
                continue
            try:
                if backend.has_module_perms(self, module):
                    return True
            except PermissionDenied:
                return False
        return False

    def is_staff(self):
        return self.is_superuser

    def has_perm(self, perm, obj=None):
        """
        Return True if the user has the specified permission. Query all
        available auth backends, but return immediately if any backend returns
        True. Thus, a user who has permission from a single auth backend is
        assumed to have permission in general. If an object is provided, check
        permissions for that object.
        """
        # Active superusers have all permissions.
        if self.is_active and self.is_superuser:
            return True

        for backend in auth.get_backends():
            if not hasattr(backend, 'has_perm'):
                continue
            try:
                if backend.has_perm(self, perm, obj):
                    return True
            except PermissionDenied:
                return False
        return False


class User(BaseUser):
    USERNAME_FIELD = 'netid'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']
    DEFAULT_PHOTO = join(settings.STATIC_URL, "images/default.jpg")
    objects = CustomUserManager()

    netid = models.CharField(max_length=20, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    first_name = models.CharField(max_length=127)
    last_name = models.CharField(max_length=127)
    email = models.CharField(max_length=255, unique=True)
    registration = models.CharField(max_length=80, blank=True)
    photo = models.CharField(max_length=10, default="")
    welcome = models.BooleanField(default=True)
    comment = models.TextField(blank=True, default='')

    inferred_faculty = models.TextField(blank=True)
    inscription_faculty = models.TextField(blank=True)

    is_superuser = models.BooleanField(default=False)
    is_academic = models.BooleanField(default=False)
    is_representative = models.BooleanField(default=False)

    moderated_courses = models.ManyToManyField('catalog.Course', blank=True)

    notify_on_response = models.BooleanField(default=True)
    notify_on_new_doc = models.BooleanField(default=True)
    notify_on_new_thread = models.BooleanField(default=True)
    notify_on_upload = True

    def __init__(self, *args, **kwargs):
        self._following_courses = None
        self._moderated_courses = None
        super(User, self).__init__(*args, **kwargs)

    @property
    def get_photo(self):
        photo = self.DEFAULT_PHOTO
        if self.photo != "":
            photo = join(settings.MEDIA_URL, "profile/{0.netid}.{0.photo}".format(self))

        return photo

    @property
    def name(self):
        return "{0.first_name} {0.last_name}".format(self)

    def notification_count(self):
        return self.notification_set.filter(read=False).count()

    def following(self):
        return actstream.models.following(self)

    def following_courses(self):
        if self._following_courses is None:
            self._following_courses = actstream.models.following(self, Course)
        return [x for x in self._following_courses if x]

    def fullname(self):
        return self.name

    def get_short_name(self):
        return self.netid

    def update_inscription_faculty(self):
        inscription = self.inscription_set.order_by("-year").first()
        if inscription:
            self.inscription_faculty = inscription.faculty
            self.save()

    def update_inferred_faculty(self):
        courses = self.following_courses()
        categories = [x.categories.all() for x in courses]
        categories = list(itertools.chain.from_iterable(categories))

        faculties = [x.get_ancestors().filter(level=1).all() for x in categories]
        faculties = list(itertools.chain.from_iterable(faculties))

        counts = collections.Counter(faculties)
        if counts:
            faculty = counts.most_common()[0][0]
            self.inferred_faculty = faculty.name
            self.save()


class Inscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    faculty = models.CharField(max_length=80, blank=True, default='')
    section = models.CharField(max_length=80, blank=True, default='')
    year = models.PositiveIntegerField(blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'section', 'faculty', 'year')
