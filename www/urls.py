# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.contrib.auth.views import logout
from django.contrib import admin
from django.conf import settings
from django.contrib.sitemaps.views import sitemap
import django_js_reverse.views
from django.conf.urls import url

import catalog.views
import users.views
import www.views
from www.helpers import mf_redirect_to

from documents.sitemap import DocumentSitemap
from catalog.sitemap import CourseSitemap

sitemaps = {
    'course': CourseSitemap,
    'document': DocumentSitemap,
}

mf_path = mf_redirect_to(www.views.index)

urlpatterns = [
    path("", www.views.index, name="index"),

    path("spa/", www.views.spa_index),
    path("spa/subscribed_courses/", catalog.views.spa_show_courses),

    path("admin/", admin.site.urls),
    path("api/", include("www.rest_urls")),

    # only here for 'django_js_reverse'
    path("categories/<int:pk>/", www.views.index, name="category_show"),
    path("courses/<slug:slug>/", www.views.index, name="course_show"),
    path("notifications/", www.views.index, name="notifications"),
    path("documents/<int:pk>/", www.views.index, name="document_show"),
    path("catalog/subscribed_courses/", www.views.index, name="show_courses"),

    path("catalog/", include("catalog.urls")),
    path("documents/", include("documents.urls")),
    path("telepathy/", include("telepathy.urls")),
    path("users/", include("users.urls")),
    path("notifications/", include("notifications.urls")),

    path("jsreverse/", django_js_reverse.views.urls_js, name='js_reverse'),

    mf_path("syslogin", www.views.login, ["POST"], name="syslogin"),
    path("auth", users.views.auth),
    path("logout", logout, {"next_page": "/"}, name="logout"),

    path("help/", www.views.HelpView.as_view(template_name='help.html'), name="help"),
    path(
        "help/markdown/",
        TemplateView.as_view(template_name='telepathy/markdown.html'),
        name="markdown_help"
    ),

    path(
        "sitemap\.xml", sitemap, {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'
    ),
    re_path(r'.*', www.views.index)
]

handler400 = 'www.error.error400'
handler403 = 'www.error.error403'
handler404 = 'www.error.error404'
handler500 = 'www.error.error500'


if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
