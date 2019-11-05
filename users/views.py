# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
from base64 import b64decode


from PIL import Image, ImageOps
from django.urls import reverse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponseRedirect, HttpResponseForbidden, JsonResponse
from django.contrib.auth import authenticate, login
from django.conf import settings

from rest_framework.authtoken.models import Token
from actstream.models import actor_stream
from www.serializers import FeedSerializer
from users.serializers import UserSerializer
from www.helpers import get_messages
from notifications.models import Notification
from notifications.serializers import NotificationSerializer

from users.forms import SettingsForm

@login_required
def user_settings(request):
    if request.method == 'POST':
        form = SettingsForm(request.POST, request.FILES)

        if form.is_valid():
            im = Image.open(request.FILES['profile_pic'])
            im = ImageOps.fit(im, (120, 120), Image.ANTIALIAS)

            if not os.path.exists(os.path.join(settings.MEDIA_ROOT, "profile")):
                os.makedirs(os.path.join(settings.MEDIA_ROOT, "profile"))

            im.save(os.path.join(settings.MEDIA_ROOT, "profile/{}.png".format(request.user.netid)))
            request.user.photo = "png"
            request.user.save()

            messages.success(request, 'Ton profil a été mis à jour.')

            return JsonResponse(dict(
                messages = get_messages(request)
            ))
        else:
            errors = get_form_errors(form)
            return JsonResponse(dict(errors=errors), status=500)

@login_required
def reset_token(request):
    Token.objects.filter(user=request.user).delete()
    Token.objects.create(user=request.user)
    messages.success(request, "La clé d'API a été regénérée")

    return JsonResponse(dict(
        messages = get_messages(request)
    ))


@login_required
def panel_hide(request):
    request.user.welcome = False
    request.user.save()

    serial = UserSerializer(request.user)
    return JsonResponse(dict(user=serial.data))


def auth(request):
    sid, uid = request.GET.get("_sid", False), request.GET.get("_uid", False)
    next = request.GET.get('next', None)
    next_64 = request.GET.get('next64', None)

    if next and next.startswith("/"):
        next_url = next
    elif next_64 and b64decode(next_64).decode().startswith("/"):
        next_url = b64decode(next_64).decode()
    else:
        next_url = "/"
    print(next_url)

    if sid and uid:
        user = authenticate(sid=sid, uid=uid)
        if user is not None:
            user.update_inscription_faculty()
            login(request, user)
            return HttpResponseRedirect(next_url)

    HttpResponseForbidden()
