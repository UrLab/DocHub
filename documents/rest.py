# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.db.models import F

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from www.rest import VaryModelViewSet

from documents.serializers import DocumentSerializer, UploadDocumentSerializer, EditDocumentSerializer
from documents.models import Document, Vote


class DocumentViewSet(VaryModelViewSet):
    queryset = Document.objects.filter(hidden=False)\
        .select_related("course", 'user')\
        .prefetch_related('tags', 'vote_set')\
        .order_by("-edited")
    serializer_class = DocumentSerializer
    create_serializer_class = UploadDocumentSerializer
    update_serializer_class = EditDocumentSerializer

    @action(detail=True)
    def original(self, request, pk):
        document = self.get_object()
        body = document.original.read()

        response = HttpResponse(body, content_type='application/octet-stream')
        response['Content-Description'] = 'File Transfer'
        response['Content-Transfer-Encoding'] = 'binary'
        response['Content-Disposition'] = 'attachment; filename="{}{}"'.format(document.safe_name, document.file_type).encode("ascii", "ignore")

        document.downloads = F('downloads') + 1
        document.save(update_fields=['downloads'])
        return response

    @action(detail=True)
    def pdf(self, request, pk):
        document = self.get_object()
        body = document.pdf.read()

        response = HttpResponse(body, content_type='application/pdf')
        response['Content-Disposition'] = ('attachment; filename="%s.pdf"' % document.safe_name).encode("ascii", "ignore")

        document.downloads = F('views') + 1
        document.save(update_fields=['views'])
        return response

    @action(detail=True, methods=['post'])
    def vote(self, request, pk):
        document = self.get_object()
        if not request.user.has_perm("documents.vote", document):
            raise PermissionDenied()

        vote, created = Vote.objects.get_or_create(document=document, user=request.user)
        vote.vote_type = request.data["vote_type"]
        vote.save()

        return Response({"status": "ok"})

    def destroy(self, request, pk=None):
        document = self.get_object()
        if not request.user.has_perm("documents.delete", document):
            raise PermissionDenied()

        document.hidden = True
        document.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
