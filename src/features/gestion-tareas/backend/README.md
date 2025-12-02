# Django Backend para Gestión de Tareas (Arquitectura Hexagonal)

## Estructura de carpetas (Hexagonal)

```
src/gestion-tareas/backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── local.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── __init__.py
│   ├── shared/
│   │   ├── __init__.py
│   │   ├── domain/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py
│   │   │   ├── value_objects.py
│   │   │   └── exceptions.py
│   │   ├── application/
│   │   │   ├── __init__.py
│   │   │   └── interfaces.py
│   │   └── infrastructure/
│   │       ├── __init__.py
│   │       ├── persistence/
│   │       │   ├── __init__.py
│   │       │   └── base.py
│   │       └── events/
│   │           ├── __init__.py
│   │           └── base.py
│   ├── backlog/
│   │   ├── __init__.py
│   │   ├── domain/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py
│   │   │   ├── value_objects.py
│   │   │   ├── repositories.py
│   │   │   └── exceptions.py
│   │   ├── application/
│   │   │   ├── __init__.py
│   │   │   ├── services.py
│   │   │   ├── dto.py
│   │   │   └── interfaces.py
│   │   ├── infrastructure/
│   │   │   ├── __init__.py
│   │   │   ├── persistence/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── models.py
│   │   │   │   ├── repositories.py
│   │   │   │   └── migrations/
│   │   │   └── api/
│   │   │       ├── __init__.py
│   │   │       ├── serializers.py
│   │   │       ├── views.py
│   │   │       └── urls.py
│   │   └── presentation/
│   │       ├── __init__.py
│   │       └── controllers.py
│   ├── sprint/
│   │   ├── __init__.py
│   │   ├── domain/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py
│   │   │   ├── value_objects.py
│   │   │   ├── repositories.py
│   │   │   └── exceptions.py
│   │   ├── application/
│   │   │   ├── __init__.py
│   │   │   ├── services.py
│   │   │   ├── dto.py
│   │   │   └── interfaces.py
│   │   ├── infrastructure/
│   │   │   ├── __init__.py
│   │   │   ├── persistence/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── models.py
│   │   │   │   ├── repositories.py
│   │   │   │   └── migrations/
│   │   │   └── api/
│   │   │       ├── __init__.py
│   │   │       ├── serializers.py
│   │   │       ├── views.py
│   │   │       └── urls.py
│   │   └── presentation/
│   │       ├── __init__.py
│   │       └── controllers.py
│   ├── historias/
│   │   ├── __init__.py
│   │   ├── domain/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py
│   │   │   ├── value_objects.py
│   │   │   ├── repositories.py
│   │   │   └── exceptions.py
│   │   ├── application/
│   │   │   ├── __init__.py
│   │   │   ├── services.py
│   │   │   ├── dto.py
│   │   │   └── interfaces.py
│   │   ├── infrastructure/
│   │   │   ├── __init__.py
│   │   │   ├── persistence/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── models.py
│   │   │   │   ├── repositories.py
│   │   │   │   └── migrations/
│   │   │   └── api/
│   │   │       ├── __init__.py
│   │   │       ├── serializers.py
│   │   │       ├── views.py
│   │   │       └── urls.py
│   │   └── presentation/
│   │       ├── __init__.py
│   │       └── controllers.py
│   └── metricas/
│       ├── __init__.py
│       ├── domain/
│       │   ├── __init__.py
│       │   ├── entities.py
│       │   ├── value_objects.py
│       │   ├── repositories.py
│       │   └── exceptions.py
│       ├── application/
│       │   ├── __init__.py
│       │   ├── services.py
│       │   ├── dto.py
│       │   └── interfaces.py
│       ├── infrastructure/
│       │   ├── __init__.py
│       │   ├── persistence/
│       │   │   ├── __init__.py
│       │   │   ├── models.py
│       │   │   ├── repositories.py
│       │   │   └── migrations/
│       │   └── api/
│       │       ├── __init__.py
│       │       ├── serializers.py
│       │       ├── views.py
│       │       └── urls.py
│       └── presentation/
│           ├── __init__.py
│           └── controllers.py
├── tests/
│   ├── __init__.py
│   ├── unit/
│   │   ├── __init__.py
│   │   └── apps/
│   │       └── (tests unitarios por app)
│   ├── integration/
│   │   ├── __init__.py
│   │   └── (tests de integración)
│   └── fixtures/
│       └── (datos de prueba)
└── docs/
    ├── api.md
    └── architecture.md
```

## Principios de Arquitectura Hexagonal

1. **Dominio** (núcleo): Entidades, Value Objects, Reglas de Negocio
2. **Aplicación**: Casos de Uso (Servicios), DTOs, Interfaces
3. **Infraestructura**: Implementaciones concretas (Django ORM, API REST, Eventos)
4. **Presentación**: Controladores que orquestan casos de uso
5. **Dependencias**: Infraestructura depende de Aplicación, Aplicación depende de Dominio

## Tecnologías

- Django 4.2+ con Django REST Framework
- PostgreSQL con psycopg2
- Redis para caché y colas (Celery)
- Django Simple History para auditoría
- Docker y Docker Compose para desarrollo
- pytest para testing
- Black, flake8, isort para calidad de código

## Configuración Inicial

1. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Crear base de datos y migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Crear superusuario:
```bash
python manage.py createsuperuser
```

6. Ejecutar servidor de desarrollo:
```bash
python manage.py runserver
```

## Testing

```bash
# Ejecutar todos los tests
pytest

# Con cobertura
pytest --cov=apps --cov-report=html

# Tests específicos de una app
pytest tests/unit/apps/backlog/
```

## Calidad de Código

```bash
# Formatear código
black apps/

# Ordenar imports
isort apps/

# Linting
flake8 apps/

# Pre-commit hooks
pre-commit run --all-files
```

## Estructura de Módulos

### Backlog del Producto
- Gestión de historias de usuario
- Priorización y estimación
- Filtros y búsqueda

### Sprint Board
- Tablero Kanban con columnas
- Gestión de tarjetas/tareas
- Movimiento y reordenamiento
- Asignación de responsables

### Repositorio de Historias
- Plantillas reutilizables
- Categorización y etiquetado
- Favoritos y duplicación
- Estadísticas de uso

### Métricas
- Indicadores de rendimiento
- Gráficos de velocidad y burndown
- Análisis de equipo
- Rangos de tiempo configurables

## Endpoints API

Ver documentación completa en `docs/api.md`

## Arquitectura

Ver documentación de arquitectura en `docs/architecture.md`