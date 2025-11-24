"""
Entidades base compartidas del dominio.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class BaseEntity:
    """Entidad base con identificador único."""
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.id is None:
            self.id = uuid4()
        if self.created_at is None:
            self.created_at = datetime.utcnow()


@dataclass
class AggregateRoot(BaseEntity):
    """Raíz de agregado base."""
    
    def mark_updated(self):
        """Marcar la entidad como actualizada."""
        self.updated_at = datetime.utcnow()