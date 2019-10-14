# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime
from django.urls import path
from django.contrib import messages

def current_year():
    now = datetime.today()
    if now.month < 9:
        return now.year - 1
    elif now.month == 9:
        return now.year - 1 if now.day < 15 else now.year
    else:
        return now.year


def year_choices(backlog=5):
    year = current_year()
    choices = [("%d-%d" % (year - i, year - i + 1),) * 2 for i in range(backlog)]
    choices.append(("Archives",) * 2)
    return choices

# wrapper to automatically redirect requests with not-matching methods
# 'mf' stands for 'method filtered'
def mf_redirect_to(redirect_view):
    def mf_path(str_path, view, methods, **kwargs):
        def view_wrapper(req, *view_args, **view_kwargs):
            real_view = redirect_view if req.method not in methods else view
            return real_view(req, *view_args, **view_kwargs)
        return path(str_path, view_wrapper, **kwargs)
    return mf_path

def get_messages(request):
    return [
        dict(
            tags = m.tags,
            message = m.message
        )
        for m in messages.get_messages(request)._queued_messages
    ]

def get_form_errors(form):
    return [
        dict(
            field = field,
            error = error
        )
        for field, errors
        in form.errors.items()
        for error in errors
    ]
