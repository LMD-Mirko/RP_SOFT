# Especificación Backend del Módulo de Gestión de Tareas (Arquitectura Hexagonal)

## Alcance

- Vistas cubiertas: Backlog del Producto, Sprint Board, Repositorio de Historias, Métricas.
- Objetivo: definir modelos de dominio, casos de uso (puertos), contratos de datos, validaciones, relaciones entre vistas y proponer endpoints/adapters para una implementación con arquitectura hexagonal.

## Modelos de Dominio

- Historia (`Story`)
  - `id`: string (ej. `US-001`)
  - `titulo`: string
  - `descripcion`: string
  - `prioridad`: enum [`Crítica`, `Alta`, `Media`, `Baja`]
  - `estado`: enum [`Lista`, `En revisión`, `Hecha`]
  - `etiqueta`: string
  - `puntos`: number|null
  - `autor`: string
  - `listaParaSprint`: boolean
  - `estimada`: boolean (derivado: `puntos != null`)
  - `createdAt?`: ISO string
  - `updatedAt?`: ISO string

- Miembro (`Member`)
  - `id`: string
  - `iniciales`: string (ej. `AM`)
  - `color?`: string (indicativo UI)

- Columna de Sprint (`SprintColumn`)
  - `id`: string (ej. `col-1`)
  - `titulo`: string
  - `cards`: `Card[]`

- Tarjeta/Tarea (`Card`)
  - `id`: string (ej. `HU01`)
  - `titulo`: string
  - `puntos`: number
  - `tags`: string[]
  - `owner`: string (iniciales del miembro)
  - `progreso`: { `done`: number, `total`: number }
  - `fecha?`: ISO date string
  - `checklist?`: { `id`: string, `text`: string, `done`: boolean }[]
  - `storyId?`: string (opcional, vínculo con `Story` del Backlog si se desea integrar)

- Plantilla de Historia (`Template`)
  - `code`: string (ej. `TPL-001`)
  - `title`: string
  - `desc`: string
  - `tag`: string (categoría)
  - `proyecto`: string
  - `favorito`: boolean
  - `clones`: number

- Métrica (`MetricStat`)
  - `id`: string [`velocidad`, `completitud`, `tiempo`, `precision`]
  - `titulo`: string
  - `valor`: string|number
  - `sufijo?`: string
  - `tendencia`: string (ej. `+5%`)
  - `color?`: string

- Series de Velocidad (`VelocitySeries`)
  - `labels`: string[]
  - `values`: number[]

- Burndown (`BurndownSeries`)
  - `labels`: string[]
  - `ideal`: number[]
  - `real`: number[]

- Desempeño de Equipo (`TeamPerformance`)
  - `id`: string
  - `iniciales`: string
  - `nombre`: string
  - `rol`: string
  - `tareas`: number
  - `puntos`: number
  - `progreso`: number (0-100)
  - `tendencia`: string (ej. `+3%`)

## Puertos (Casos de Uso)

- Backlog (`StoryService`)
  - `ListStories(query?, priority?, state?, sort?) => Story[]`
  - `CreateStory(storyInput) => Story`
  - `UpdateStory(id, patch) => Story`
  - `DeleteStory(id) => void`

- Sprint (`SprintService`)
  - `GetSprintStats() => { ... }`
  - `GetMembers() => Member[]`
  - `GetColumns() => SprintColumn[]`
  - `SaveColumns(columns: SprintColumn[]) => void`
  - `AddCard(columnId, cardInput) => Card`
  - `UpdateCard(columnId, cardId, patch) => Card`
  - `DeleteCard(columnId, cardId) => void`
  - `MoveCard(fromColumnId, toColumnId, cardId) => void`
  - `MoveCardWithin(columnId, cardId, targetCardId) => void`
  - `AddColumn(title) => SprintColumn`
  - `RenameColumn(columnId, newTitle) => SprintColumn`
  - `DeleteColumn(columnId) => void`
  - `MoveColumn(columnId, targetColumnId) => void`

- Repositorio de Historias (`TemplateService`)
  - `GetRepoStats() => { total, masUsadas, clonadasMes, categorias }`
  - `GetRepoFilters() => { categorias[], etiquetas[], proyectos[], orden[] }`
  - `ListTemplates(filters) => Template[]`
  - `CreateTemplate(templateInput) => Template`
  - `UpdateTemplate(code, patch) => Template`
  - `DeleteTemplate(code) => void`
  - `DuplicateTemplate(code) => Template`
  - `ToggleFavorito(code) => Template`

- Métricas (`MetricsService`)
  - `GetAllMetrics(range) => { stats: MetricStat[], velocity: VelocitySeries, burndown: BurndownSeries, team: TeamPerformance[] }`

## Contratos de Datos (Inputs/Outputs)

- `StoryInput`
  - `titulo`: string (requerido)
  - `descripcion`: string
  - `prioridad`: enum
  - `estado`: enum
  - `etiqueta`: string
  - `puntos?`: number
  - `autor?`: string
  - `listaParaSprint?`: boolean

- `CardInput`
  - `id`: string (si lo genera backend, opcional en input)
  - `titulo`: string (requerido)
  - `puntos`: number
  - `tags?`: string[]
  - `owner?`: string
  - `progreso?`: { `done`: number, `total`: number }
  - `fecha?`: ISO date string
  - `checklist?`: { `id`: string, `text`: string, `done`: boolean }[]
  - `storyId?`: string (para vínculo a Backlog)

- `TemplateInput`
  - `title`: string (requerido)
  - `desc`: string
  - `tag`: string (categoría)
  - `proyecto`: string

- `MetricsRange`
  - enum: [`Sprint Actual`, `Ultimo Sprint`, `Ultimo Sprints`, `Este Mes`, `Este Trimestre`]

## Endpoints Propuestos

- Backlog
  - `GET /backlog/stories?query=&priority=&state=&sort=` → `Story[]`
  - `GET /backlog/stats` → `{ total, puntos, listasSprint, sinEstimar }`
  - `POST /backlog/stories` (body: `StoryInput`) → `Story`
  - `PATCH /backlog/stories/:id` (body: `Partial<StoryInput>`) → `Story`
  - `DELETE /backlog/stories/:id` → `204`

- Sprint
  - `GET /sprint/stats` → `{ nombre, estado, duracion, diasRestantes, puntosHechos, puntosTotales, velocidad, tendencia, equipo }`
  - `GET /sprint/members` → `Member[]`
  - `GET /sprint/columns` → `SprintColumn[]`
  - `PUT /sprint/columns` (body: `SprintColumn[]`) → `200` (persistencia del tablero)
  - `POST /sprint/cards` (body: `{ columnId, card: CardInput }`) → `Card`
  - `PATCH /sprint/cards/:id` (body: `Partial<CardInput>`) → `Card`
  - `DELETE /sprint/cards/:id` (query: `columnId`) → `204`
  - `POST /sprint/cards/:id/move` (body: `{ fromColumnId, toColumnId }`) → `200`
  - `POST /sprint/cards/:id/move-within` (body: `{ columnId, targetCardId }`) → `200`
  - `POST /sprint/columns` (body: `{ title }`) → `SprintColumn`
  - `PATCH /sprint/columns/:id` (body: `{ titulo }`) → `SprintColumn`
  - `DELETE /sprint/columns/:id` → `204`
  - `POST /sprint/columns/:id/move` (body: `{ targetColumnId }`) → `200`

- Repositorio de Historias
  - `GET /repo/stats` → `{ total, masUsadas, clonadasMes, categorias }`
  - `GET /repo/filters` → `{ categorias[], etiquetas[], proyectos[], orden[] }`
  - `GET /repo/templates?query=&categoria=&etiqueta=&proyecto=&orden=` → `Template[]`
  - `POST /repo/templates` (body: `TemplateInput`) → `Template`
  - `PATCH /repo/templates/:code` (body: `Partial<TemplateInput> & { favorito? }`) → `Template`
  - `DELETE /repo/templates/:code` → `204`
  - `POST /repo/templates/:code/duplicate` → `Template`
  - `POST /repo/templates/:code/toggle-favorito` → `Template`

- Métricas
  - `GET /metrics?range=` → `{ stats[], velocity, burndown, team }`

## Enumeraciones y Opciones (UI → Dominio)

- Backlog: `prioridades` = [`Crítica`, `Alta`, `Media`, `Baja`]
- Backlog: `estados` = [`Lista`, `En revisión`, `Hecha`]
- Sprint: `presetLabels` = [`Prioridad Alta`, `Back-End`, `Front-End`, `Seguridad`, `Base de Datos`, `Diseño`]
- Repositorio: `categorias`, `etiquetas`, `proyectos`, `orden` según `GET /repo/filters`
- Métricas: `ranges` según `MetricsRange`

## Validaciones (Front y Backend)

- `StoryInput.titulo`: requerido, 3–160 caracteres.
- `StoryInput.prioridad`: debe estar en el enum.
- `StoryInput.estado`: debe estar en el enum.
- `StoryInput.puntos`: entero ≥ 0 o `null`.
- `CardInput.titulo`: requerido, 3–160 caracteres.
- `CardInput.puntos`: entero ≥ 0.
- `CardInput.tags`: lista de strings (sin duplicados idealmente).
- `CardInput.owner`: debe existir en `Member.iniciales`.
- `TemplateInput.title`: requerido.
- `TemplateInput.tag`: debe estar en `categorias`.
- `TemplateInput.proyecto`: debe estar en `proyectos`.

## Relación Entre Vistas

- Backlog → Sprint Board
  - Opción de vinculación: `Card.storyId = Story.id` para rastrear el origen de la tarea.
  - Caso de uso: mover historia del Backlog al Sprint crea una `Card` con campos mapeados: `titulo`, `puntos`, `tags` (desde `etiqueta`), `owner` (selección), `storyId`.

- Sprint Board → Métricas
  - Las métricas se alimentan del progreso de tarjetas: velocidad, completitud y burndown calculados sobre `Card.progreso` y actividad por periodo (`range`).

- Repositorio de Historias → Backlog
  - Al crear en Backlog “desde plantilla”, se precargan campos: `titulo` ← `title`, `descripcion` ← `desc`, `etiqueta` ← `tag` y `proyecto` puede registrarse en metadatos.

## Eventos de Dominio (opcional)

- `StoryCreated`, `StoryUpdated`, `StoryDeleted`
- `CardAdded`, `CardUpdated`, `CardDeleted`, `CardMoved`
- `ColumnAdded`, `ColumnRenamed`, `ColumnDeleted`, `ColumnMoved`
- `TemplateCreated`, `TemplateUpdated`, `TemplateDeleted`, `TemplateDuplicated`, `TemplateToggledFavorito`
- `MetricsRangeChanged`

## Puertos y Adaptadores (Hexagonal)

- Entradas (Application/In-bound ports)
  - `StoryService`, `SprintService`, `TemplateService`, `MetricsService`

- Salidas (Outbound ports)
  - `StoryRepository` (DB)
  - `SprintRepository` (DB, incluye columnas y tarjetas)
  - `TemplateRepository` (DB)
  - `MetricsProvider` (DB/aggregation o servicio analítico)

- Adaptadores
  - HTTP REST (controllers) como adapters de entrada
  - Persistencia (ORM/DAO) como adapters de salida
  - Cache/localStorage como adapter alternativo de salida

## Ejemplos de Payload

- `POST /backlog/stories`
```json
{
  "titulo": "Como usuario quiero restablecer mi contraseña",
  "descripcion": "Flujo con email y token de seguridad",
  "prioridad": "Alta",
  "estado": "Lista",
  "etiqueta": "Autenticación",
  "puntos": 5,
  "autor": "Juan Perez",
  "listaParaSprint": true
}
```

- `POST /sprint/cards`
```json
{
  "columnId": "col-1",
  "card": {
    "titulo": "Implementar recuperación de contraseña",
    "puntos": 5,
    "tags": ["Autenticación", "Seguridad"],
    "owner": "JP",
    "progreso": { "done": 0, "total": 17 },
    "storyId": "US-002"
  }
}
```

- `POST /repo/templates`
```json
{
  "title": "CRUD de Usuarios",
  "desc": "Crear, leer, actualizar y eliminar usuarios con validaciones",
  "tag": "CRUD",
  "proyecto": "PB-M2 (Usuarios)"
}
```

- `GET /metrics?range=Sprint%20Actual`
```json
{
  "stats": [
    { "id": "velocidad", "titulo": "Velocidad Promedio", "valor": "42", "sufijo": "pts/sprint", "tendencia": "+5%" }
  ],
  "velocity": { "labels": ["Sprint 1", "Sprint 2"], "values": [45, 52] },
  "burndown": { "labels": ["Día 1", "Día 2"], "ideal": [55, 46], "real": [55, 50] },
  "team": [
    { "id": "u1", "iniciales": "JP", "nombre": "Juan Perez", "rol": "Senior Backend", "tareas": 24, "puntos": 48, "progreso": 85, "tendencia": "+5%" }
  ]
}
```

## Observaciones de Integración

- IDs consistentes entre Backlog y Sprint permiten trazabilidad (`storyId`).
- Validar enumeraciones en backend para evitar valores fuera de catálogo.
- Soportar filtros y orden en endpoints de listado (query-string).
- `SaveColumns` debe ser transaccional para evitar inconsistencias de orden.
- Métricas pueden consumirse de agregaciones o pre-cálculos; considerar ventanas por rango.

## Movimientos y Persistencia (Sprint Board)

- Semántica de movimiento de tarjeta
  - Al mover una tarjeta entre columnas (`fromColumnId → toColumnId`) se debe:
    - Remover la tarjeta de la columna origen y agregarla al inicio de la columna destino conservando sus campos.
    - Emitir evento `CardMoved` con `{ cardId, fromColumnId, toColumnId, byUserId, at }`.
    - Persistir el nuevo estado de columnas de forma transaccional.
  - Referencia UI: `src/features/gestion-tareas/hooks/useSprintBoard.js:64-88`.

- Reorden dentro de una columna
  - Al reubicar una tarjeta en la misma columna respecto a otra de referencia (`targetCardId`), se mantiene el orden estable.
  - Emitir evento `CardReordered` con `{ columnId, cardId, targetCardId, byUserId, at }`.
  - Persistir columnas con `PUT /sprint/columns`.
  - Referencia UI: `src/features/gestion-tareas/hooks/useSprintBoard.js:26-43`.

- Movimiento de columnas
  - Reordenar columnas conservando orden relativo; transacción en persistencia.
  - Evento `ColumnMoved` con `{ columnId, targetColumnId, byUserId, at }`.
  - Referencia UI: `src/features/gestion-tareas/hooks/useSprintBoard.js:148-162`.

## Reglas de Negocio

- Story ↔ Card
  - Si se habilita trazabilidad, `Card.storyId` debe apuntar a `Story.id` existente.
  - Una historia puede originar varias tarjetas (descomposición) o una tarjeta puede referenciar una historia única.

- Estados y catálogos
  - `prioridad` y `estado` en Backlog deben validar contra catálogos.
  - `owner` de tarjetas debe existir en `Member`.

- Persistencia
  - `SaveColumns` debe ser idempotente y transaccional; incluir control de versión para evitar write-loss.

## Auditoría y Versionado

- Audit Trail
  - Registrar `who`, `when`, `what` para operaciones: crear/editar/eliminar/mover (cards y columnas), cambios de favoritos/duplicación de plantillas.
  - Mantener `createdAt`/`updatedAt` y `auditLogId` opcional.

- Versionado
  - DTOs con `schemaVersion` si se prevén cambios.
  - Endpoints con `Accept-Version` via header, o versionado por ruta (`/v1`, `/v2`).

## Tiempo Real (Opcional)

- Canales SSE/WebSocket
  - `sprint.columns.updated` para cambios de columnas/tarjetas.
  - `repo.templates.updated` para cambios en plantillas.
  - `metrics.range.updated` para cambios de rango/series.

## Concurrencia e Idempotencia

- Idempotencia
  - `POST /sprint/cards/:id/move` aceptar `Idempotency-Key` para evitar dobles movimientos.

- Concurrencia
  - ETag/If-Match en `PUT /sprint/columns` para control de versión.
  - Estrategia optimistic locking en repositorios.

## Autorización y Seguridad

- Roles sugeridos
  - `admin`: total
  - `product_owner`: Backlog y planificación
  - `developer`: mover/editar tarjetas
  - `viewer`: lectura

- Reglas
  - Sólo roles con permisos pueden mover tarjetas o columnas.
  - Validar entrada y sanitizar texto (XSS), límites de tamaño y rate limiting en endpoints de escritura.

## Errores y Códigos

- Código/Descripción
  - `400` Validación de campos (mensaje y detalle por campo).
  - `401/403` Autenticación/Autorización.
  - `404` Recurso no encontrado (story/card/column/template).
  - `409` Conflicto de versión (ETag/If-Match).
  - `422` Semántica inválida (p.ej., `owner` inexistente).
  - `500` Error interno.

## Paginación y Orden

- Listados (Backlog/Repositorio)
  - `page`, `pageSize`, `sortBy`, `sortDir` y filtros.
  - Respuesta incluir `total`, `pages`, `page`.

## Mapeo UI ↔ Dominio (Referencias de código)

- Backlog Panel: creación y campos (`src/features/gestion-tareas/modules/backlog/components/BacklogPanel.jsx:293-346`) → `StoryInput`.
- Sprint Board: creación/edición de tarjeta (`src/features/gestion-tareas/modules/sprint/components/SprintBoard.jsx:231-268`, `310-414`) → `CardInput`, `UpdateCard`.
- Sprint Board: filtros y stats (`src/features/gestion-tareas/modules/sprint/components/SprintBoard.jsx:580-635`) → `GetMembers`, `GetSprintStats`.
- Repositorio de Historias: modal de plantilla (`src/features/gestion-tareas/modules/historias/components/TemplateModal.jsx:71-105`) → `TemplateInput`.
- Métricas: selector de rango (`src/features/gestion-tareas/modules/metricas/pages/Metrics.jsx:23-34`) → `MetricsRange`.

## Indicadores por Vista y Fuentes de Datos

- Vista General (si aplica en tu proyecto)
  - Indicadores: total de postulantes, formularios, en prueba, aprobados.
  - Endpoint sugerido: `GET /dashboard/overview` → `{ postulantes, formularios, enPrueba, aprobados }`.
  - Fuente: servicios/domino externos al módulo de gestión de tareas (RRHH/Recruitment). Agregar adapters específicos.

- Backlog del Producto
  - Indicadores: `total historias`, `puntos estimados`, `listas para sprint`, `sin estimar`.
  - Endpoint: `GET /backlog/stats` → `{ total, puntos, listasSprint, sinEstimar }`.
  - Fuente: repositorio de `Story` (conteos y agregaciones sobre campos `puntos`, `listaParaSprint`, `estimada`).
  - UI referencia: `src/features/gestion-tareas/modules/backlog/components/BacklogPanel.jsx:198-203`.

- Sprint Board
  - Indicadores: `duración`, `puntos del sprint (hechos/totales)`, `velocidad`, `equipo`.
  - Endpoint: `GET /sprint/stats`.
  - Fuente: repositorio de columnas/tarjetas (`SprintColumn`/`Card`) y tabla de configuración del sprint.
  - UI referencia: `src/features/gestion-tareas/modules/sprint/components/SprintBoard.jsx:600-622`.

- Repositorio de Historias
  - Indicadores: `total de plantillas`, `más usadas`, `clonadas este mes`, `categorías`.
  - Endpoint: `GET /repo/stats`.
  - Fuente: repositorio de `Template` con agregaciones y conteos; `clones` alimenta “más usadas”.
  - UI referencia: `src/features/gestion-tareas/modules/historias/pages/HistoryRepo.jsx:15-21`.

- Métricas
  - Indicadores: `velocidad promedio`, `tasa de completitud`, `tiempo promedio`, `precisión de estimación`.
  - Endpoint: `GET /metrics?range=`.
  - Fuente: proveedor analítico (`MetricsProvider`) con agregaciones por `range`.
  - UI referencia: `src/features/gestion-tareas/modules/metricas/pages/Metrics.jsx:39-48`.

## Tabla de Mapeo UI → Dominio

### Backlog: formulario “Nueva Historia”

| Campo UI | Tipo | Dominio | Opciones | Notas |
|---|---|---|---|---|
| Título | string | `StoryInput.titulo` | — | Requerido |
| Descripción | string | `StoryInput.descripcion` | — | Opcional |
| Prioridad | enum | `StoryInput.prioridad` | Crítica, Alta, Media, Baja | Catálogo |
| Estado | enum | `StoryInput.estado` | Lista, En revisión, Hecha | Catálogo |
| Etiqueta | string | `StoryInput.etiqueta` | — | Texto libre |
| Puntos | number|null | `StoryInput.puntos` | — | Entero ≥ 0 o null |
| Autor | string | `StoryInput.autor` | — | Texto libre |
| Lista para Sprint | boolean | `StoryInput.listaParaSprint` | — | Casilla |

### Sprint Board: creación/edición de tarjeta

| Campo UI | Tipo | Dominio | Opciones | Notas |
|---|---|---|---|---|
| Título | string | `CardInput.titulo` | — | Requerido |
| Puntos | number | `CardInput.puntos` | — | Entero ≥ 0 |
| Etiquetas (texto) | string (coma) | `CardInput.tags` | — | Se normaliza a lista |
| Asignado | string | `CardInput.owner` | iniciales de `Member` | Catálogo miembros |
| Fecha | date | `CardInput.fecha` | — | ISO date |
| Checklist | lista | `CardInput.checklist[]` | — | Ítems con `{id,text,done}` |

### Repositorio de Historias: modal “Nuevo Historial”

| Campo UI | Tipo | Dominio | Opciones | Notas |
|---|---|---|---|---|
| Título | string | `TemplateInput.title` | — | Requerido |
| Descripción | string | `TemplateInput.desc` | — | Opcional |
| Categoría | string | `TemplateInput.tag` | Autenticación, CRUD, UI, Integración API, Reportes, Notificaciones | Catálogo `GET /repo/filters` |
| Proyecto | string | `TemplateInput.proyecto` | PB-M1… PB-M5 | Catálogo `GET /repo/filters` |

### Métricas: selector de rango

| Campo UI | Tipo | Dominio | Opciones | Notas |
|---|---|---|---|---|
| Rango | enum | `MetricsRange` | Sprint Actual, Último Sprint, Último Sprints, Este Mes, Este Trimestre | Actualiza datasets |

## Acciones UI → Endpoints/Eventos

| Acción UI | Endpoint | Evento de dominio | Notas |
|---|---|---|---|
| Crear historia (Backlog) | `POST /backlog/stories` | `StoryCreated` | Alta en Backlog |
| Editar historia | `PATCH /backlog/stories/:id` | `StoryUpdated` | Validar enums |
| Eliminar historia | `DELETE /backlog/stories/:id` | `StoryDeleted` | — |
| Crear tarjeta (Sprint) | `POST /sprint/cards` | `CardAdded` | Puede incluir `storyId` |
| Editar tarjeta | `PATCH /sprint/cards/:id` | `CardUpdated` | — |
| Eliminar tarjeta | `DELETE /sprint/cards/:id` | `CardDeleted` | — |
| Mover tarjeta columna a columna | `POST /sprint/cards/:id/move` | `CardMoved` | Persistencia transaccional |
| Reordenar tarjeta en columna | `POST /sprint/cards/:id/move-within` | `CardReordered` | Orden estable |
| Añadir columna | `POST /sprint/columns` | `ColumnAdded` | — |
| Renombrar columna | `PATCH /sprint/columns/:id` | `ColumnRenamed` | Trim nombre |
| Eliminar columna | `DELETE /sprint/columns/:id` | `ColumnDeleted` | — |
| Mover columna | `POST /sprint/columns/:id/move` | `ColumnMoved` | Persistente |
| Crear plantilla | `POST /repo/templates` | `TemplateCreated` | — |
| Editar plantilla | `PATCH /repo/templates/:code` | `TemplateUpdated` | — |
| Eliminar plantilla | `DELETE /repo/templates/:code` | `TemplateDeleted` | — |
| Duplicar plantilla | `POST /repo/templates/:code/duplicate` | `TemplateDuplicated` | Incrementa clones |
| Favorito plantilla | `POST /repo/templates/:code/toggle-favorito` | `TemplateToggledFavorito` | — |
| Cambiar rango métricas | `GET /metrics?range=` | `MetricsRangeChanged` | Cache opcional |