# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.apps import apps

from django.contrib.admin.sites import AlreadyRegistered

app_models = apps.get_app_config('dbhack').get_models()
for model in app_models:
    if model._meta.object_name not in []:
        try:
            admin.site.register(model)
        except AlreadyRegistered:
            pass
