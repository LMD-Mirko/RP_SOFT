"""
Objetos de valor compartidos del dominio.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class Priority(str, Enum):
    """Prioridades de historias y tareas."""
    CRITICAL = "Crítica"
    HIGH = "Alta"
    MEDIUM = "Media"
    LOW = "Baja"


class Status(str, Enum):
    """Estados de historias y tareas."""
    TODO = "Lista"
    IN_PROGRESS = "En progreso"
    IN_REVIEW = "En revisión"
    DONE = "Hecha"


@dataclass
class StoryPoints:
    """Objeto de valor para puntos de historia."""
    value: Optional[int] = None
    
    def __post_init__(self):
        if self.value is not None and self.value < 0:
            raise ValueError("Story points cannot be negative")
    
    def is_estimated(self) -> bool:
        """Verificar si está estimada."""
        return self.value is not None


@dataclass
class Label:
    """Etiqueta para categorización."""
    name: str
    color: Optional[str] = None
    
    def __post_init__(self):
        if not self.name or len(self.name.strip()) == 0:
            raise ValueError("Label name cannot be empty")
        self.name = self.name.strip()


@dataclass
class Member:
    """Miembro del equipo."""
    initials: str
    name: str
    role: Optional[str] = None
    color: Optional[str] = None
    
    def __post_init__(self):
        if not self.initials or len(self.initials.strip()) == 0:
            raise ValueError("Member initials cannot be empty")
        if not self.name or len(self.name.strip()) == 0:
            raise ValueError("Member name cannot be empty")
        self.initials = self.initials.strip().upper()
        self.name = self.name.strip()


@dataclass
class Progress:
    """Progreso de una tarea."""
    done: int = 0
    total: int = 0
    
    def __post_init__(self):
        if self.done < 0 or self.total < 0:
            raise ValueError("Progress values cannot be negative")
        if self.done > self.total:
            raise ValueError("Done cannot be greater than total")
    
    def percentage(self) -> float:
        """Obtener porcentaje de progreso."""
        if self.total == 0:
            return 0.0
        return (self.done / self.total) * 100
    
    def is_complete(self) -> bool:
        """Verificar si está completa."""
        return self.done == self.total and self.total > 0