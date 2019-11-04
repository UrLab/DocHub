# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import url

from notifications import views

urlpatterns = [
    url(r"^read/(?P<pk>[0-9]+)$", views.markAsRead, name="mark_as_read"),
    url(r"^redirect/(?P<pk>[0-9]+)$", views.markAsReadAndRedirect, name="read_and_redirect"),
    url(r"^read_all$", views.markAllAsRead, name="read_all"),
]
