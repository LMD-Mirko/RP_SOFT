from django.db import models
from apps.shared.domain.entities import BaseEntity
from apps.shared.domain.value_objects import Priority, Status, Label


class UserStory(BaseEntity):
    """Entidad UserStory para gestionar historias de usuario"""
    
    title = models.CharField(max_length=255, verbose_name='Título')
    description = models.TextField(verbose_name='Descripción')
    as_a = models.CharField(max_length=255, verbose_name='Como')
    i_want = models.CharField(max_length=255, verbose_name='Quiero')
    so_that = models.CharField(max_length=255, verbose_name='Para que')
    
    acceptance_criteria = models.TextField(
        blank=True,
        verbose_name='Criterios de Aceptación'
    )
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
    story_points = models.IntegerField(
        choices=[
            (1, '1 punto'),
            (2, '2 puntos'),
            (3, '3 puntos'),
            (5, '5 puntos'),
            (8, '8 puntos'),
            (13, '13 puntos'),
            (21, '21 puntos'),
        ],
        null=True,
        blank=True,
        verbose_name='Puntos de Historia'
    )
    
    backlog_item = models.OneToOneField(
        'backlog.BacklogItem',
        on_delete=models.CASCADE,
        related_name='user_story',
        verbose_name='Elemento del Backlog'
    )
    
    author = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='authored_stories',
        verbose_name='Autor'
    )
    
    labels = models.JSONField(
        default=list,
        blank=True,
        verbose_name='Etiquetas'
    )
    
    epic = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Épica'
    )
    
    class Meta:
        db_table = 'user_stories'
        verbose_name = 'Historia de Usuario'
        verbose_name_plural = 'Historias de Usuario'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_priority_display()}"
    
    @property
    def full_story(self):
        """Retorna la historia completa en formato estándar"""
        return f"Como {self.as_a} quiero {self.i_want} para que {self.so_that}"
    
    @property
    def is_ready_for_development(self):
        """Verifica si la historia está lista para desarrollo"""
        return (
            self.status == Status.TODO.value and
            self.acceptance_criteria and
            self.story_points is not None
        )
    
    def update_status(self, new_status):
        """Actualiza el estado de la historia"""
        if new_status in [s.value for s in Status]:
            self.status = new_status
            self.save(update_fields=['status'])
    
    def add_label(self, label):
        """Agrega una etiqueta a la historia"""
        if label not in self.labels:
            self.labels.append(label)
            self.save(update_fields=['labels'])


class StoryTask(BaseEntity):
    """Entidad StoryTask para gestionar tareas dentro de una historia de usuario"""
    
    story = models.ForeignKey(
        'historias.UserStory',
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='Historia de Usuario'
    )
    
    title = models.CharField(max_length=255, verbose_name='Título')
    description = models.TextField(blank=True, verbose_name='Descripción')
    
    status = models.CharField(
        max_length=20,
        choices=[(s.value, s.name) for s in Status],
        default=Status.TODO.value,
        verbose_name='Estado'
    )
    
    assigned_to = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_story_tasks',
        verbose_name='Asignado a'
    )
    
    estimated_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Horas Estimadas'
    )
    
    actual_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Horas Reales'
    )
    
    started_at = models.DateTimeField(null=True, blank=True, verbose_name='Iniciado en')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Completado en')
    
    order = models.IntegerField(default=0, verbose_name='Orden')
    
    class Meta:
        db_table = 'story_tasks'
        verbose_name = 'Tarea de Historia'
        verbose_name_plural = 'Tareas de Historia'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.title} - {self.story.title[:30]}"
    
    @property
    def is_completed(self):
        """Verifica si la tarea está completada"""
        return self.status == Status.DONE.value
    
    @property
    def completion_percentage(self):
        """Calcula el porcentaje de completitud basado en horas"""
        if self.estimated_hours and self.actual_hours:
            return min(int((self.actual_hours / self.estimated_hours) * 100), 100)
        return 0
    
    def start_task(self):
        """Inicia la tarea"""
        if self.status == Status.TODO.value:
            from django.utils import timezone
            self.status = Status.IN_PROGRESS.value
            self.started_at = timezone.now()
            self.save(update_fields=['status', 'started_at'])
    
    def complete_task(self):
        """Completa la tarea"""
        if self.status == Status.IN_PROGRESS.value:
            from django.utils import timezone
            self.status = Status.DONE.value
            self.completed_at = timezone.now()
            self.save(update_fields=['status', 'completed_at'])


class StoryComment(BaseEntity):
    """Entidad StoryComment para gestionar comentarios en historias"""
    
    story = models.ForeignKey(
        'historias.UserStory',
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Historia de Usuario'
    )
    
    content = models.TextField(verbose_name='Contenido')
    
    author = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='story_comments',
        verbose_name='Autor'
    )
    
    is_internal = models.BooleanField(
        default=False,
        verbose_name='Es interno'
    )
    
    class Meta:
        db_table = 'story_comments'
        verbose_name = 'Comentario de Historia'
        verbose_name_plural = 'Comentarios de Historia'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comentario de {self.author.username} en {self.story.title[:30]}"