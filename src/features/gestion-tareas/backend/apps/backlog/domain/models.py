from django.db import models
from django.contrib.auth.models import User
from apps.shared.domain.entities import BaseEntity
from apps.shared.domain.value_objects import Priority, Status, StoryPoints


class BacklogItem(BaseEntity):
    """Modelo de dominio para ítems del backlog"""
    
    title = models.CharField(max_length=255, verbose_name='Título')
    description = models.TextField(blank=True, verbose_name='Descripción')
    priority = models.CharField(
        max_length=20,
        choices=[(p.value, p.name) for p in Priority],
        default=Priority.MEDIUM.value,
        verbose_name='Prioridad'
    )
    status = models.CharField(
        max_length=20,
        choices=[(s.value, s.name) for s in Status],
        default=Status.TODO.value,
        verbose_name='Estado'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_backlog_items',
        verbose_name='Asignado a'
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_backlog_items',
        verbose_name='Creado por'
    )
    due_date = models.DateField(null=True, blank=True, verbose_name='Fecha límite')
    story_points = models.IntegerField(
        choices=[(i, i) for i in range(1, 21)],
        null=True,
        blank=True,
        verbose_name='Puntos de historia'
    )
    labels = models.JSONField(default=list, blank=True, verbose_name='Etiquetas')
    
    class Meta:
        db_table = 'backlog_items'
        verbose_name = 'Ítem del Backlog'
        verbose_name_plural = 'Ítems del Backlog'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def is_overdue(self):
        """Verifica si el ítem está vencido"""
        if self.due_date and self.status != Status.DONE.value:
            from datetime import date
            return self.due_date < date.today()
        return False


class BacklogComment(BaseEntity):
    """Modelo de dominio para comentarios de backlog"""
    
    backlog_item = models.ForeignKey(
        BacklogItem,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Ítem del Backlog'
    )
    content = models.TextField(verbose_name='Contenido')
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='backlog_comments',
        verbose_name='Autor'
    )
    
    class Meta:
        db_table = 'backlog_comments'
        verbose_name = 'Comentario del Backlog'
        verbose_name_plural = 'Comentarios del Backlog'
        ordering = ['created_at']
    
    def __str__(self):
        return f'Comentario de {self.author.username} en {self.backlog_item.title}'