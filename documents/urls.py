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

    mf_path("multiple_upload/<slug:slug>",
        documents.views.upload_multiple_files,
        ["POST"],
        name="document_put_multiple"),

    mf_path("<int:pk>/edit",
        documents.views.document_edit,
        ["POST"],
        name="document_edit"),

    mf_path("<int:pk>/reupload",
        documents.views.document_reupload,
        ["POST"],
        name="document_reupload"),

]
