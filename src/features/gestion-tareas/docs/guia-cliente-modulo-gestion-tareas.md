# Guía del Módulo de Gestión de Tareas

Esta guía explica, en lenguaje sencillo, cómo funciona el módulo de Gestión de Tareas. Está pensada para personas que usan el sistema y no necesitan entender el código.

## Qué incluye el módulo

- Backlog del Producto: listado maestro de historias de usuario por gestionar.
- Sprint Board: tablero del sprint para trabajar tareas en columnas (por estado o fase).
- Repositorio de Historias: biblioteca de plantillas reutilizables.
- Métricas: indicadores y gráficos sobre el desempeño del equipo.

## Relación de vistas (flujo entre pantallas)

- Backlog del Producto → Sprint Board:
  - El Backlog es la fuente donde se registran y priorizan las historias. La acción "Agregar al Sprint" está pensada para mover una historia hacia el tablero del sprint, donde se trabaja día a día.
  - En el flujo actual, la creación en Backlog es manual y el tablero del sprint gestiona sus propias tarjetas; la vinculación puede habilitarse según el proceso de tu equipo.

- Sprint Board → Métricas:
  - Las métricas reflejan el trabajo realizado en el sprint: velocidad, completitud, burndown, etc. Su información se alimenta del avance en el tablero (tareas y progreso).

- Repositorio de Historias → Backlog del Producto:
  - El repositorio guarda plantillas reutilizables. Al crear nuevas historias en el Backlog, se pueden basar en estas plantillas para acelerar la captura.
  - No hay sincronización automática: las plantillas ayudan como referencia al registrar historias nuevas.

- Independencia y navegación:
  - Cada vista funciona de forma independiente para evitar bloqueos: puedes gestionar plantillas sin afectar el tablero, y revisar métricas sin modificar el Backlog.
  - El flujo recomendado es: crear/priorizar en Backlog → planificar y ejecutar en Sprint Board → analizar en Métricas → retroalimentar con plantillas en Repositorio de Historias.

## Backlog del Producto

El Backlog es donde se registran y priorizan las historias de usuario del producto.

- Buscar y filtrar:
  - Barra de búsqueda para encontrar por ID, título o descripción.
  - Filtro de “Estado” para ver historias “Lista”, “En revisión”, etc.
  - Ordenar por prioridad, puntos, fecha o estado.
- Ver estadísticas rápidas:
  - Total de historias, puntos estimados, historias listas para sprint y sin estimar.
- Crear una nueva historia:
  - Botón “Nueva Historia” abre un formulario con campos: título, descripción, prioridad, estado, etiqueta, puntos y autor.
  - Permite marcar si la historia está “Lista para Sprint”.
  - Al crearla, aparece inmediatamente en la lista con sus etiquetas y valores.

### Campos del formulario “Nueva Historia”

- Título: texto libre con el objetivo de la historia.
- Descripción: texto libre con detalles, contexto y criterios.
- Prioridad: selección entre “Crítica”, “Alta”, “Media”, “Baja”.
- Estado: selección entre “Lista”, “En revisión”, “Hecha”.
- Etiqueta: texto libre (por ejemplo, “Autenticación”, “Reportes”).
- Puntos: número entero (estimación; si no se indica queda sin estimar).
- Autor: texto libre (nombre de quien registra la historia).
- Lista para Sprint: casilla de verificación para marcar si está lista.

## Sprint Board

El tablero del sprint muestra las tareas organizadas en columnas y permite trabajar de forma visual.

- Vista horizontal:
  - Se puede desplazar lateralmente para recorrer las columnas.
  - Hay sombras y flechas que facilitan navegar a izquierda y derecha.
- Crear y gestionar tareas:
  - Botón “Agregar Tarea” para añadir una tarjeta a una columna.
  - Editar o eliminar una tarjeta desde sus acciones.
  - Arrastrar y soltar tarjetas entre columnas o dentro de la misma columna (organización manual).
- Filtros rápidos:
  - Filtrar por responsable (dueño) y por etiqueta.
- Opciones de columna:
  - Cambiar el nombre de una columna.
  - Eliminar una columna (con confirmación).
- Estado y progreso:
  - Cada tarjeta muestra avance (checklist o progreso total) y metadatos (fecha, etiquetas).

### Campos de creación de tarjeta

- Título: texto libre.
- Puntos: número entero.
- Etiquetas: texto libre separadas por coma.
- Asignado: selección de iniciales de miembros del equipo.

### Campos de edición de tarjeta

- Título: texto libre.
- Puntos: número entero.
- Responsable: selección de miembro.
- Etiquetas: selección rápida de etiquetas predefinidas y editor para añadir/quitar.
- Fecha: selección de fecha.
- Checklist: lista de tareas con casillas de verificación, añadir y eliminar ítems.

### Opciones de columna

- Renombrar columna: texto del nuevo nombre.
- Eliminar columna: acción con confirmación.

## Repositorio de Historias

Es una biblioteca de plantillas de historias de usuario para reutilizar.

- Buscar y filtrar:
  - Por texto libre en título, descripción o código de plantilla.
  - Por categoría/etiquetas, proyecto y orden (más populares, recientes, favoritas).
- Acciones sobre cada plantilla:
  - Marcar como favorita (para acceso más rápido).
  - Duplicar (crear copia y aumentar contador de uso).
  - Editar (actualizar título, descripción, categoría, proyecto, etc.).
  - Eliminar (remover del repositorio).
- Crear nueva plantilla:
  - Botón “Nuevo Historial” abre un formulario para capturar la plantilla.
  - Al guardarla, se agrega al repositorio y queda disponible para filtrar y reutilizar.

### Campos del formulario “Nuevo Historial”

- Título: texto libre.
- Descripción: texto libre.
- Categoría: selección entre opciones como “Autenticación”, “CRUD”, “Interfaz de Usuario”, “Integración API”, “Reportes”, “Notificaciones”.
- Proyecto: selección entre opciones como “PB-M1 (Autenticación)”, “PB-M2 (Usuarios)”, “PB-M3 (Dashboard)”, “PB-M4 (Reportes)”, “PB-M5 (API)”.

## Métricas

Provee indicadores clave y visualizaciones para evaluar el trabajo del sprint.

- Selección de rango:
  - Elegir el periodo (por ejemplo, sprint actual) para ver datos correspondientes.
- Indicadores principales (tarjetas):
  - Velocidad promedio, tasa de completitud, tiempo promedio, precisión de estimación.
- Gráficos:
  - Velocidad del equipo por sprint (barras).
  - Burndown (líneas de ideal vs real del progreso del sprint).
- Experiencia visual:
  - Transiciones suaves al cambiar de rango y animación de entrada de paneles para mejorar legibilidad.

### Indicadores por vista y fuente de datos

- Vista General (si aplica): muestra totales de postulantes, formularios, en prueba y aprobados. Se obtiene de servicios del área correspondiente (RRHH/Recruitment) mediante un endpoint de resumen (`/dashboard/overview`).
- Backlog del Producto: total historias, puntos estimados, listas para sprint y sin estimar. Se calcula sobre las historias registradas (`/backlog/stats`).
- Sprint Board: duración, puntos del sprint (hechos/totales), velocidad y equipo. Proviene de la configuración y avance del sprint (`/sprint/stats`).
- Repositorio de Historias: total de plantillas, más usadas, clonadas este mes y categorías. Se obtiene del repositorio de plantillas (`/repo/stats`).
- Métricas: velocidad promedio, tasa de completitud, tiempo promedio y precisión de estimación. Se obtiene del servicio de métricas con rango seleccionado (`/metrics?range=`).

### Selector de rango

- Rango: selección del periodo de análisis (por ejemplo, “Sprint Actual”), que actualiza los indicadores y gráficos con una transición suave.

## Flujo recomendado de uso

1. Registrar y priorizar en Backlog:
   - Crear nuevas historias, completar campos básicos y marcar “Lista para Sprint” cuando corresponda.
2. Planificar el Sprint:
   - En el Sprint Board, organizar columnas y arrastrar historias/tareas a la etapa adecuada.
3. Ejecutar y dar seguimiento:
   - Usar el Sprint Board para actualizar progreso, checklist y responsables.
4. Analizar resultados:
   - En Métricas, revisar indicadores y gráficos para entender el desempeño y tendencias.
5. Reutilizar conocimiento:
   - En Repositorio de Historias, crear/editar plantillas y duplicarlas cuando hagan falta.

## Acciones comunes y buenas prácticas

- Mantener títulos y descripciones claras para facilitar la búsqueda.
- Usar etiquetas consistentes (por ejemplo, “Autenticación”, “Reportes”) para filtrar mejor.
- Actualizar el estado y puntos estimados de las historias para reflejar su madurez.
- Aprovechar las plantillas para acelerar la creación de historias similares.
- Revisar las métricas al cierre del sprint para ajustar procesos y estimaciones.

