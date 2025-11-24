from django.db import models
from apps.shared.domain.entities import BaseEntity
from apps.shared.domain.value_objects import Priority, Status


class Sprint(BaseEntity):
    """Entidad Sprint para gestionar ciclos de desarrollo"""
    
    name = models.CharField(max_length=100, verbose_name='Nombre del Sprint')
    description = models.TextField(blank=True, verbose_name='Descripción')
    start_date = models.DateField(verbose_name='Fecha de Inicio')
    end_date = models.DateField(verbose_name='Fecha de Fin')
    goal = models.TextField(blank=True, verbose_name='Objetivo del Sprint')
    status = models.CharField(
        max_length=20,
        choices=[
            ('planning', 'Planificación'),
            ('active', 'Activo'),
            ('review', 'Revisión'),
            ('retrospective', 'Retrospectiva'),
            ('completed', 'Completado'),
        ],
        default='planning',
        verbose_name='Estado'
    )
    velocity = models.IntegerField(default=0, verbose_name='Velocidad')
    created_by = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='created_sprints',
        verbose_name='Creado por'
    )
    
    class Meta:
        db_table = 'sprints'
        verbose_name = 'Sprint'
        verbose_name_plural = 'Sprints'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"
    
    @property
    def is_active(self):
        """Verifica si el sprint está activo"""
        from datetime import date
        return self.status == 'active' and self.start_date <= date.today() <= self.end_date
    
    @property
    def is_completed(self):
        """Verifica si el sprint está completado"""
        return self.status == 'completed'
    
    @property
    def progress_percentage(self):
        """Calcula el porcentaje de progreso del sprint"""
        if self.status == 'completed':
            return 100
        
        total_tasks = self.tasks.count()
        if total_tasks == 0:
            return 0
        
        completed_tasks = self.tasks.filter(status=Status.DONE.value).count()
        return int((completed_tasks / total_tasks) * 100)
    
    def start_sprint(self):
        """Inicia el sprint"""
        if self.status == 'planning':
            self.status = 'active'
            self.save(update_fields=['status'])
    
    def complete_sprint(self):
        """Completa el sprint"""
        if self.status in ['active', 'review']:
            self.status = 'completed'
            self.save(update_fields=['status'])


class SprintTask(BaseEntity):
    """Entidad SprintTask para gestionar tareas dentro de un sprint"""
    
    sprint = models.ForeignKey(
        'sprint.Sprint',
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='Sprint'
    )
    backlog_item = models.ForeignKey(
        'backlog.BacklogItem',
        on_delete=models.CASCADE,
        related_name='sprint_tasks',
        verbose_name='Elemento del Backlog'
    )
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
        related_name='assigned_sprint_tasks',
        verbose_name='Asignado a'
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
    priority = models.CharField(
        max_length=20,
        choices=[(p.value, p.name) for p in Priority],
        default=Priority.MEDIUM.value,
        verbose_name='Prioridad'
    )
    started_at = models.DateTimeField(null=True, blank=True, verbose_name='Iniciado en')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Completado en')
    
    class Meta:
        db_table = 'sprint_tasks'
        verbose_name = 'Tarea del Sprint'
        verbose_name_plural = 'Tareas del Sprint'
        ordering = ['priority', 'created_at']
        unique_together = ['sprint', 'backlog_item']
    
    def __str__(self):
        return f"{self.backlog_item.title} - {self.sprint.name}"
    
    @property
    def is_completed(self):
        """Verifica si la tarea está completada"""
        return self.status == Status.DONE.value
    
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
    
    def move_to_sprint(self, new_sprint):
        """Mueve la tarea a otro sprint"""
        self.sprint = new_sprint
        self.save(update_fields=['sprint'])


class SprintMember(BaseEntity):
    """Entidad SprintMember para gestionar miembros del sprint"""
    
    sprint = models.ForeignKey(
        'sprint.Sprint',
        on_delete=models.CASCADE,
        related_name='members',
        verbose_name='Sprint'
    )
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='sprint_memberships',
        verbose_name='Usuario'
    )
    role = models.CharField(
        max_length=50,
        choices=[
            ('developer', 'Desarrollador'),
            ('scrum_master', 'Scrum Master'),
            ('product_owner', 'Product Owner'),
            ('tester', 'Tester'),
        ],
        default='developer',
        verbose_name='Rol'
    )
    capacity = models.IntegerField(
        default=100,
        help_text='Capacidad del miembro en porcentaje (0-100)',
        verbose_name='Capacidad'
    )
    
    class Meta:
        db_table = 'sprint_members'
        verbose_name = 'Miembro del Sprint'
        verbose_name_plural = 'Miembros del Sprint'
        unique_together = ['sprint', 'user']
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.sprint.name}"
    
    @property
    def is_scrum_master(self):
        """Verifica si el miembro es Scrum Master"""
        return self.role == 'scrum_master'
    
    @property
    def is_product_owner(self):
        """Verifica si el miembro es Product Owner"""
        return self.role == 'product_owner'