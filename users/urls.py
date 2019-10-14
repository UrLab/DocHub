# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import path
import users.views
import www.views

from www.helpers import mf_redirect_to

mf_path = mf_redirect_to(www.views.index)

urlpatterns = [
    mf_path("settings/", users.views.user_settings, ["POST"], name="settings"),
    path("reset_token", users.views.reset_token, name="reset_token"),
    path("panel_hide", users.views.panel_hide, name="hide_new_panel"),
]
