# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import uuid

from django.urls import reverse
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from django.db.models import F
from django.conf import settings


from actstream import action

from documents.models import Document
from catalog.models import Course
from documents.forms import UploadFileForm, FileForm, MultipleUploadFileForm, ReUploadForm
from tags.models import Tag
from documents import logic
from tags.serializers import TagSerializer
from catalog.serializers import ShortCourseSerializer
from www.helpers import get_form_errors

def error_response(status, error, field='form'):
    return JsonResponse(dict(
        errors = dict(
            field = field,
            error = error
    )), status = status)

READ_ONLY_ERROR_RESPONSE = error_response(401, 'Upload is disabled for a few hours')

@login_required
def spa_upload_file(request, slug):
    course = get_object_or_404(Course, slug=slug)
    courseSerial = ShortCourseSerializer(course, context={'request': request})
    tags = Tag.objects.all()
    tagSerial = TagSerializer(tags, many=True)
    return JsonResponse(dict(
        course = courseSerial.data,
        tags = tagSerial.data
    ))

@login_required
def upload_file(request, slug):
    course = get_object_or_404(Course, slug=slug)

    if request.method == 'POST':
        if settings.READ_ONLY:
            return READ_ONLY_ERROR_RESPONSE

        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']

            name, extension = os.path.splitext(file.name)
            name = logic.clean_filename(name)

            if form.cleaned_data['name']:
                name = form.cleaned_data['name']

            document = logic.add_file_to_course(
                file=file,
                name=name,
                extension=extension,
                course=course,
                tags=form.cleaned_data['tags'],
                user=request.user
            )

            document.description = form.cleaned_data['description']
            document.save()

            document.add_to_queue()

            return JsonResponse({})
        else:
            errors = get_form_errors(form)
            return JsonResponse(dict(errors=errors), status=500)


@login_required
def upload_multiple_files(request, slug):
    course = get_object_or_404(Course, slug=slug)
    if request.method == 'POST':
        if settings.READ_ONLY:
            return READ_ONLY_ERROR_RESPONSE
        form = MultipleUploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            for attachment in form.cleaned_data['files']:
                name, extension = os.path.splitext(attachment.name)
                name = logic.clean_filename(name)

                document = logic.add_file_to_course(
                    file=attachment,
                    name=name,
                    extension=extension,
                    course=course,
                    tags=[],
                    user=request.user
                )
                document.add_to_queue()

            return JsonResponse({})
        else:
            errors = get_form_errors(form)
            return JsonResponse(dict(errors=errors), status=500)


@login_required
def document_edit(request, pk):
    doc = get_object_or_404(Document, id=pk)

    if not request.user.write_perm(obj=doc):
        return error_response(403, 'You may not edit this document.')

    if request.method == 'POST':
        if settings.READ_ONLY:
            return error_response(401, 'Editing is disabled for a few hours')

        form = FileForm(request.POST)

        if form.is_valid():
            doc.name = form.cleaned_data['name']
            doc.description = form.cleaned_data['description']

            doc.tags.clear()
            for tag in form.cleaned_data['tags']:
                doc.tags.add(Tag.objects.get(name=tag))

            doc.save()

            action.send(request.user, verb="a édité", action_object=doc, target=doc.course)

            return JsonResponse({})
        else:
            errors = get_form_errors(form)
            return JsonResponse(dict(errors=errors), status=500)

@login_required
def document_reupload(request, pk):
    document = get_object_or_404(Document, pk=pk)

    if not request.user.write_perm(obj=document):
        return error_response(403, 'You may not edit this document.')

    if document.state != "DONE":
        return error_response(403, 'You may not edit this document while it is processing.')

    if request.method == 'POST':
        if settings.READ_ONLY:
            return error_response(401, 'Upload is disabled for a few hours')

        form = ReUploadForm(request.POST, request.FILES)

        if form.is_valid():
            file = request.FILES['file']
            name, extension = os.path.splitext(file.name)

            document.pdf.delete(save=False)
            document.original.delete(save=False)

            document.original.save(str(uuid.uuid4()) + extension, file)

            document.state = "PREPARING"
            document.save()

            document.reprocess(force=True)

            action.send(
                request.user,
                verb="a uploadé une nouvelle version de",
                action_object=document,
                target=document.course
            )

            return JsonResponse({})
        else:
            errors = get_form_errors(form)
            return JsonResponse(dict(errors=errors), status=500)
