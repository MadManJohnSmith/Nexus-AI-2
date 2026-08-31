from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from apps.students.models import Student, Semester
from apps.evidence.models import Evidence


class Publication(models.Model):
    """
    Modelo para el registro de publicaciones científicas generadas
    durante los estudios de posgrado doctoral (HU-17).
    """
    TIPO_JCR = 'ARTICULO_JCR'
    TIPO_CONACYT = 'ARTICULO_CONACYT'
    TIPO_LIBRO = 'CAPITULO_LIBRO'
    TIPO_OTRO = 'OTRO'
    TIPO_CHOICES = (
        (TIPO_JCR, _('Artículo JCR / Scopus')),
        (TIPO_CONACYT, _('Artículo Conacyt / Índice Nacional')),
        (TIPO_LIBRO, _('Capítulo de Libro')),
        (TIPO_OTRO, _('Otro')),
    )

    ESTADO_PREPARACION = 'PREPARACION'
    ESTADO_ENVIADO = 'ENVIADO'
    ESTADO_EN_REVISION = 'EN_REVISION'
    ESTADO_ACEPTADO = 'ACEPTADO'
    ESTADO_PUBLICADO = 'PUBLICADO'
    ESTADO_CHOICES = (
        (ESTADO_PREPARACION, _('En Preparación')),
        (ESTADO_ENVIADO, _('Enviado')),
        (ESTADO_EN_REVISION, _('En Revisión')),
        (ESTADO_ACEPTADO, _('Aceptado')),
        (ESTADO_PUBLICADO, _('Publicado')),
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='publications',
        db_index=True,
        verbose_name=_('estudiante')
    )
    semester = models.ForeignKey(
        Semester,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='publications',
        verbose_name=_('semestre')
    )
    titulo = models.CharField(
        _('título'),
        max_length=255
    )
    autores_texto = models.TextField(
        _('autores'),
        help_text=_('Lista de autores en formato APA o IEEE')
    )
    tipo = models.CharField(
        _('tipo de publicación'),
        max_length=30,
        choices=TIPO_CHOICES
    )
    revista_editorial = models.CharField(
        _('revista o editorial'),
        max_length=255
    )
    estado = models.CharField(
        _('estado'),
        max_length=30,
        choices=ESTADO_CHOICES,
        default=ESTADO_PREPARACION
    )
    fecha_publicacion = models.DateField(
        _('fecha de publicación'),
        null=True,
        blank=True,
        db_index=True
    )
    doi_url = models.CharField(
        _('DOI o URL'),
        max_length=500,
        blank=True,
        default=''
    )
    evidencia = models.ForeignKey(
        Evidence,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='publications',
        verbose_name=_('evidencia')
    )
    created_at = models.DateTimeField(_('fecha de creación'), auto_now_add=True)
    updated_at = models.DateTimeField(_('última actualización'), auto_now=True)

    class Meta:
        verbose_name = _('publicación')
        verbose_name_plural = _('publicaciones')
        ordering = ['-fecha_publicacion', '-created_at']

    def clean(self):
        super().clean()
        if self.student and self.semester and self.semester.student_id != self.student.id:
            raise ValidationError({
                'semester': _('El semestre seleccionado no pertenece al estudiante asignado.')
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.matricula} - {self.titulo} ({self.get_estado_display()})"
