# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import include, path

import www.views

urlpatterns = [
    path("", www.views.spa_index),
    path("syslogin", www.views.spa_index),
]
