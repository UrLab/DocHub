# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import path
from catalog.views import search_course
import catalog.views

urlpatterns = [
    path("search/", search_course, name="course_search"),

    path("join/<slug:slug>", catalog.views.join_course, name="join_course"),
    path("leave/<slug:slug>", catalog.views.leave_course, name="leave_course"),
    path("unfollow_all_courses/", catalog.views.unfollow_all_courses, name="unfollow_all_courses"),

    path("course_tree.json", catalog.views.course_tree, name="course_tree"),
]
