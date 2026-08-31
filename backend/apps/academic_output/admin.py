from django.contrib import admin
from .models import Publication


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'titulo', 'tipo', 'revista_editorial', 'estado', 'fecha_publicacion')
    list_filter = ('tipo', 'estado', 'fecha_publicacion')
    search_fields = ('titulo', 'autores_texto', 'revista_editorial', 'student__matricula', 'student__user__first_name', 'student__user__last_name')
