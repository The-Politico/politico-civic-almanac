from django.contrib import admin
from .models import ElectionEvent


class ElectionEventAdmin(admin.ModelAdmin):
    pass


admin.site.register(ElectionEvent, ElectionEventAdmin)
