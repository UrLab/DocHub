# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import path
import documents.views
import www.views
from www.helpers import mf_redirect_to

mf_path = mf_redirect_to(www.views.index)

urlpatterns = [
    mf_path("upload/<slug:slug>",
        documents.views.upload_file,
        ["POST"],
        name="document_put"),

    path("multiple_upload/<slug:slug>",
        documents.views.upload_multiple_files,
        name="document_put_multiple"),

    mf_path("<int:pk>/edit",
        documents.views.document_edit,
        ["POST"],
        name="document_edit"),

    path("<int:pk>/reupload",
        documents.views.document_reupload,
        name="document_reupload"),

]
