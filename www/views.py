# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.shortcuts import render
from actstream.models import user_stream
from django.conf import settings
from django.views.generic import TemplateView
from django.template.loader import get_template
from django.db.models import Sum
from django.contrib.auth import authenticate, login as django_login
from django.http import JsonResponse

from telepathy.models import Thread
from documents.models import Document
from users.models import User
from users.authBackend import NetidBackend
from catalog.forms import SearchForm
from catalog.models import Category
from users.serializers import UserSerializer
from catalog.serializers import CategorySerializer
from documents.serializers import DocumentSerializer
from www.serializers import FeedSerializer

from rest_framework import viewsets
from rest_framework.response import Response

def index(request, *args, **kwargs):
    return render(request, "skel.html", {})

def spa_index(request):
    def floor(num, r=1):
        r = 10 ** r
        return int((num // r) * r) if r != 0 else 0

    if Document.objects.count():
        page_count = Document.objects.all().aggregate(Sum('pages'))['pages__sum']
    else:
        page_count = 0

    context = dict(
        login_url = NetidBackend.login_url("").url,
        debug = settings.DEBUG,
        stats = dict(
            documents = floor(Document.objects.count()),
            pages = floor(page_count, 2),
            users = floor(User.objects.count()),
            threads = floor(Thread.objects.count())
        ),
        user = dict(is_authenticated = False)
    )

    if request.user.is_authenticated:
        streams = user_stream(request.user).exclude(verb="started following")[:10]
        feedSerial = FeedSerializer(streams, many=True)
        following = request.user.following_courses()
        ndocs = max(5, len(following))
        documents = Document.objects.filter(course__in=following).order_by("-created")[:ndocs]
        docSerial = DocumentSerializer(documents, many=True)
        faculties = Category.objects.get(level=0).children.all()
        facSerial = CategorySerializer(faculties, many=True, context=dict(request=request))
        userSerial = UserSerializer(request.user, context={'request': request})
        context.update(dict(
            stream = feedSerial.data,
            recent_docs = docSerial.data,
            faculties = facSerial.data,
            user = userSerial.data
        ))
    return JsonResponse(context)

def login(request):
    if request.method=="POST":
        body = json.loads(request.body.decode('utf-8'))
        username = body.get('username', '')
        password = body.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            django_login(request, user)
            return JsonResponse({})
        else:
            return JsonResponse(dict(
                errors= ["Wrong username or password.",]
            ))

class HelpView(TemplateView):
    def get_context_data(self):
        r = super(HelpView, self).get_context_data()
        r["faq_md"] = get_template("faq.md").render()
        return r
