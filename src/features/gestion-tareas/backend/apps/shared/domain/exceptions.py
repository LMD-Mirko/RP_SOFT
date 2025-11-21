"""
Excepciones de dominio compartidas.
"""


class DomainException(Exception):
    """Excepción base del dominio."""
    pass


class ValidationException(DomainException):
    """Excepción de validación de dominio."""
    
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(message)


class NotFoundException(DomainException):
    """Excepción cuando un recurso no es encontrado."""
    
    def __init__(self, resource: str, identifier: str):
        message = f"{resource} with identifier {identifier} not found"
        super().__init__(message)


class BusinessRuleException(DomainException):
    """Excepción por violación de regla de negocio."""
    pass


class ConflictException(DomainException):
    """Excepción por conflicto de estado o versión."""
    pass