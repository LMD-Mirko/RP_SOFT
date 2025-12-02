from django.db import models
from apps.shared.domain.entities import BaseEntity


class SprintMetric(BaseEntity):
    """Entidad SprintMetric para gestionar métricas de sprint"""
    
    sprint = models.OneToOneField(
        'sprint.Sprint',
        on_delete=models.CASCADE,
        related_name='metrics',
        verbose_name='Sprint'
    )
    
    # Métricas de velocidad
    planned_velocity = models.IntegerField(
        default=0,
        verbose_name='Velocidad Planificada'
    )
    actual_velocity = models.IntegerField(
        default=0,
        verbose_name='Velocidad Real'
    )
    velocity_variance = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        verbose_name='Varianza de Velocidad (%)'
    )
    
    # Métricas de completitud
    planned_story_points = models.IntegerField(
        default=0,
        verbose_name='Puntos de Historia Planificados'
    )
    completed_story_points = models.IntegerField(
        default=0,
        verbose_name='Puntos de Historia Completados'
    )
    completion_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        verbose_name='Tasa de Completitud (%)'
    )
    
    # Métricas de tiempo
    total_tasks = models.IntegerField(
        default=0,
        verbose_name='Total de Tareas'
    )
    completed_tasks = models.IntegerField(
        default=0,
        verbose_name='Tareas Completadas'
    )
    average_task_duration = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        verbose_name='Duración Promedio de Tareas (horas)'
    )
    
    # Métricas de equipo
    team_size = models.IntegerField(
        default=0,
        verbose_name='Tamaño del Equipo'
    )
    average_tasks_per_member = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        verbose_name='Promedio de Tareas por Miembro'
    )
    
    # Métricas de calidad
    bugs_found = models.IntegerField(
        default=0,
        verbose_name='Errores Encontrados'
    )
    bugs_resolved = models.IntegerField(
        default=0,
        verbose_name='Errores Resueltos'
    )
    bug_resolution_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        verbose_name='Tasa de Resolución de Errores (%)'
    )
    
    class Meta:
        db_table = 'sprint_metrics'
        verbose_name = 'Métrica de Sprint'
        verbose_name_plural = 'Métricas de Sprint'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Métricas de {self.sprint.name}"
    
    def calculate_velocity_variance(self):
        """Calcula la varianza de velocidad"""
        if self.planned_velocity > 0:
            variance = ((self.actual_velocity - self.planned_velocity) / self.planned_velocity) * 100
            self.velocity_variance = round(variance, 2)
            self.save(update_fields=['velocity_variance'])
    
    def calculate_completion_rate(self):
        """Calcula la tasa de completitud"""
        if self.planned_story_points > 0:
            rate = (self.completed_story_points / self.planned_story_points) * 100
            self.completion_rate = round(rate, 2)
            self.save(update_fields=['completion_rate'])
    
    def calculate_bug_resolution_rate(self):
        """Calcula la tasa de resolución de errores"""
        if self.bugs_found > 0:
            rate = (self.bugs_resolved / self.bugs_found) * 100
            self.bug_resolution_rate = round(rate, 2)
            self.save(update_fields=['bug_resolution_rate'])


class TeamMetric(BaseEntity):
    """Entidad TeamMetric para gestionar métricas del equipo"""
    
    METRIC_TYPES = [
        ('productivity', 'Productividad'),
        ('quality', 'Calidad'),
        ('velocity', 'Velocidad'),
        ('collaboration', 'Colaboración'),
        ('satisfaction', 'Satisfacción'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Nombre de la Métrica')
    metric_type = models.CharField(
        max_length=20,
        choices=METRIC_TYPES,
        verbose_name='Tipo de Métrica'
    )
    
    value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor'
    )
    
    unit = models.CharField(
        max_length=50,
        verbose_name='Unidad de Medida'
    )
    
    target_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Valor Objetivo'
    )
    
    measurement_date = models.DateField(
        verbose_name='Fecha de Medición'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Descripción'
    )
    
    calculated_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='calculated_metrics',
        verbose_name='Calculado por'
    )
    
    class Meta:
        db_table = 'team_metrics'
        verbose_name = 'Métrica de Equipo'
        verbose_name_plural = 'Métricas de Equipo'
        ordering = ['-measurement_date', '-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.value} {self.unit}"
    
    @property
    def performance_percentage(self):
        """Calcula el porcentaje de desempeño respecto al objetivo"""
        if self.target_value and self.target_value > 0:
            percentage = (self.value / self.target_value) * 100
            return round(percentage, 2)
        return None
    
    @property
    def is_achieved(self):
        """Verifica si se alcanzó el objetivo"""
        if self.target_value:
            return self.value >= self.target_value
        return None


class IndividualMetric(BaseEntity):
    """Entidad IndividualMetric para gestionar métricas individuales"""
    
    METRIC_TYPES = [
        ('productivity', 'Productividad'),
        ('quality', 'Calidad'),
        ('velocity', 'Velocidad'),
        ('collaboration', 'Colaboración'),
        ('learning', 'Aprendizaje'),
        ('satisfaction', 'Satisfacción'),
    ]
    
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='individual_metrics',
        verbose_name='Usuario'
    )
    
    name = models.CharField(max_length=100, verbose_name='Nombre de la Métrica')
    metric_type = models.CharField(
        max_length=20,
        choices=METRIC_TYPES,
        verbose_name='Tipo de Métrica'
    )
    
    value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor'
    )
    
    unit = models.CharField(
        max_length=50,
        verbose_name='Unidad de Medida'
    )
    
    sprint = models.ForeignKey(
        'sprint.Sprint',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='individual_metrics',
        verbose_name='Sprint'
    )
    
    measurement_date = models.DateField(
        verbose_name='Fecha de Medición'
    )
    
    notes = models.TextField(
        blank=True,
        verbose_name='Notas'
    )
    
    class Meta:
        db_table = 'individual_metrics'
        verbose_name = 'Métrica Individual'
        verbose_name_plural = 'Métricas Individuales'
        ordering = ['-measurement_date', '-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.user.get_full_name() or self.user.username}"
    
    def get_trend(self, previous_metrics=None):
        """Calcula la tendencia comparando con métricas anteriores"""
        if previous_metrics:
            if previous_metrics.value > 0:
                trend = ((self.value - previous_metrics.value) / previous_metrics.value) * 100
                return round(trend, 2)
        return None


class MetricAlert(BaseEntity):
    """Entidad MetricAlert para gestionar alertas de métricas"""
    
    ALERT_TYPES = [
        ('threshold', 'Umbral'),
        ('trend', 'Tendencia'),
        ('anomaly', 'Anomalía'),
    ]
    
    ALERT_SEVERITY = [
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
        ('critical', 'Crítica'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Nombre de la Alerta')
    alert_type = models.CharField(
        max_length=20,
        choices=ALERT_TYPES,
        verbose_name='Tipo de Alerta'
    )
    
    severity = models.CharField(
        max_length=20,
        choices=ALERT_SEVERITY,
        default='medium',
        verbose_name='Severidad'
    )
    
    metric_name = models.CharField(
        max_length=100,
        verbose_name='Nombre de la Métrica'
    )
    
    current_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor Actual'
    )
    
    threshold_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor Umbral'
    )
    
    message = models.TextField(
        verbose_name='Mensaje'
    )
    
    is_resolved = models.BooleanField(
        default=False,
        verbose_name='Está Resuelta'
    )
    
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Resuelta en'
    )
    
    resolved_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_alerts',
        verbose_name='Resuelta por'
    )
    
    class Meta:
        db_table = 'metric_alerts'
        verbose_name = 'Alerta de Métrica'
        verbose_name_plural = 'Alertas de Métricas'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_severity_display()}"
    
    def resolve(self, user=None):
        """Resuelve la alerta"""
        from django.utils import timezone
        self.is_resolved = True
        self.resolved_at = timezone.now()
        self.resolved_by = user
        self.save(update_fields=['is_resolved', 'resolved_at', 'resolved_by'])