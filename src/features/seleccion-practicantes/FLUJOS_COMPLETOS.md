# 📋 Flujos Completos - RPSoft Backend

Este documento describe los flujos completos de uso del sistema tanto para **Postulantes** como para **Administradores**.

**Base URL:** `http://localhost:8000/api/`

---

## 👤 FLUJO COMPLETO: POSTULANTE

### 📍 Paso 1: Registro o Login

#### Opción A: Registro (Primera vez)

**Endpoint:** `POST /api/auth/register/`

**Request:**
```json
{
  "email": "postulante@example.com",
  "password": "password123",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García"
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente como Postulante",
  "user": {
    "id": "b889d574-0e72-5717-be54-295d54482be5",
    "email": "postulante@example.com",
    "username": "postulante",
    "name": "Juan",
    "paternal_lastname": "Pérez",
    "maternal_lastname": "García",
    "role_id": 1,
    "provider": "email"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE:** Guardar los tokens en `localStorage` o `sessionStorage`:
```javascript
localStorage.setItem('access_token', response.tokens.access);
localStorage.setItem('refresh_token', response.tokens.refresh);
localStorage.setItem('user', JSON.stringify(response.user));
```

---

#### Opción B: Login (Usuario existente)

**Endpoint:** `POST /api/auth/login/`

**Request:**
```json
{
  "email": "postulante@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "b889d574-0e72-5717-be54-295d54482be5",
    "email": "postulante@example.com",
    "username": "postulante",
    "name": "Juan",
    "paternal_lastname": "Pérez",
    "maternal_lastname": "García",
    "role_id": 1,
    "provider": "email"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Opción C: Login OAuth (Google/Microsoft)

**Endpoint:** `POST /api/auth/oauth/`

**Request (Usuario existente):**
```json
{
  "provider": "google",
  "provider_id": "123456789"
}
```

**Request (Usuario nuevo):**
```json
{
  "provider": "google",
  "provider_id": "123456789",
  "email": "user@gmail.com",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "role_id": 1
}
```

---

### 📍 Paso 2: Ver Convocatorias Disponibles

**Endpoint:** `GET /api/convocatorias/?estado=abierta`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "title": "Convocatoria de Desarrollo Web",
      "description": "Buscamos desarrolladores web",
      "start_date": "2025-01-01T00:00:00Z",
      "end_date": "2025-12-31T23:59:59Z",
      "status": "abierta",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

**Flujo en Frontend:**
1. Mostrar lista de convocatorias abiertas
2. Permitir al usuario seleccionar una convocatoria
3. Mostrar detalles de la convocatoria seleccionada

---

### 📍 Paso 3: Postularse a una Convocatoria

**Endpoint:** `POST /api/postulants/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request:**
```json
{
  "job_posting_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "job_posting_id": 1,
  "state": "pendiente",
  "created_at": "2025-01-01T00:00:00Z"
}
```

**⚠️ IMPORTANTE:** 
- El usuario solo puede postularse una vez por convocatoria
- Si ya está postulado, recibirá error 400

**Flujo en Frontend:**
1. Usuario hace clic en "Postularme" en una convocatoria
2. Se envía la petición
3. Si es exitoso, mostrar mensaje de confirmación
4. Redirigir a la página de completar datos personales

---

### 📍 Paso 4: Cargar Datos para el Formulario de Datos Personales

Antes de completar los datos personales, necesitas cargar las opciones para los selects:

#### 4.1. Cargar Tipos de Documento

**Endpoint:** `GET /api/document-types/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "DNI",
      "description": "Documento Nacional de Identidad",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Pasaporte",
      "description": "Pasaporte",
      "is_active": true
    }
  ],
  "total": 2
}
```

#### 4.2. Cargar Especialidades

**Endpoint:** `GET /api/specialties/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Desarrollo Web",
      "description": "Especialidad en desarrollo web",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Desarrollo Móvil",
      "description": "Especialidad en desarrollo móvil",
      "is_active": true
    }
  ],
  "total": 10
}
```

#### 4.3. Cargar Datos Geográficos (Select en Cascada)

**⚠️ IMPORTANTE:** El país siempre será Perú (country_id = 184)

**4.3.1. Cargar Regiones de Perú**

**Endpoint:** `GET /api/countries/184/regions/`

**Response:**
```json
{
  "country_id": 184,
  "results": [
    {
      "id": 1,
      "name": "Amazonas",
      "country_id": 184
    },
    {
      "id": 15,
      "name": "Lima",
      "country_id": 184
    }
  ],
  "total": 25
}
```

**4.3.2. Cargar Provincias (cuando se selecciona una región)**

**Endpoint:** `GET /api/regions/{region_id}/provinces/`

**Ejemplo:** `GET /api/regions/15/provinces/` (Lima)

**Response:**
```json
{
  "region_id": 15,
  "results": [
    {
      "id": 150,
      "name": "Lima",
      "region_id": 15
    },
    {
      "id": 151,
      "name": "Barranca",
      "region_id": 15
    }
  ],
  "total": 10
}
```

**4.3.3. Cargar Distritos (cuando se selecciona una provincia)**

**Endpoint:** `GET /api/provinces/{province_id}/districts/`

**Ejemplo:** `GET /api/provinces/150/districts/` (Lima)

**Response:**
```json
{
  "province_id": 150,
  "results": [
    {
      "id": 150101,
      "name": "Lima",
      "province_id": 150
    },
    {
      "id": 150102,
      "name": "Ancón",
      "province_id": 150
    }
  ],
  "total": 43
}
```

**Flujo del Select en Cascada:**
```javascript
// 1. Al cargar el componente
const COUNTRY_ID = 184; // Perú
loadRegions(COUNTRY_ID);

// 2. Cargar regiones
async function loadRegions(countryId) {
  const response = await fetch(`/api/countries/${countryId}/regions/`);
  const data = await response.json();
  setRegions(data.results);
  setProvinces([]);
  setDistricts([]);
}

// 3. Cuando se selecciona una región
async function onRegionChange(regionId) {
  setSelectedRegion(regionId);
  setSelectedProvince(null);
  setSelectedDistrict(null);
  
  const response = await fetch(`/api/regions/${regionId}/provinces/`);
  const data = await response.json();
  setProvinces(data.results);
  setDistricts([]);
}

// 4. Cuando se selecciona una provincia
async function onProvinceChange(provinceId) {
  setSelectedProvince(provinceId);
  setSelectedDistrict(null);
  
  const response = await fetch(`/api/provinces/${provinceId}/districts/`);
  const data = await response.json();
  setDistricts(data.results);
}
```

---

### 📍 Paso 5: Completar Datos Personales

**Endpoint:** `POST /api/postulants/me/personal-data/`

**⚠️ IMPORTANTE:** Este endpoint usa automáticamente el usuario autenticado. No necesitas pasar el `postulant_id`.

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request:**
```json
{
  "document_type_id": 1,
  "document_number": "12345678",
  "birth_date": "1990-01-01",
  "sex": "M",
  "phone": "+51987654321",
  "country_id": 184,
  "region_id": 15,
  "province_id": 150,
  "district_id": 150101,
  "address": "Av. Principal 123",
  "specialty_id": 1,
  "career": "Ingeniería de Sistemas",
  "semester": "10",
  "experience_level": "intermedio"
}
```

**Campos:**
- `document_type_id` (int, requerido): ID del tipo de documento
- `document_number` (string, requerido): Número de documento
- `birth_date` (string, requerido): Fecha de nacimiento (YYYY-MM-DD)
- `sex` (string, requerido): `"M"` o `"F"`
- `phone` (string, requerido): Teléfono
- `country_id` (int, requerido): Siempre `184` (Perú)
- `region_id` (int, requerido): ID de la región seleccionada
- `province_id` (int, requerido): ID de la provincia seleccionada
- `district_id` (int, requerido): ID del distrito seleccionado
- `address` (string, requerido): Dirección
- `specialty_id` (int, requerido): ID de la especialidad
- `career` (string, requerido): Carrera
- `semester` (string, requerido): Semestre
- `experience_level` (string, requerido): `"principiante"`, `"intermedio"`, o `"avanzado"`

**Response:**
```json
{
  "id": 1,
  "postulant_id": 1,
  "document_type_id": 1,
  "document_number": "12345678",
  "birth_date": "1990-01-01",
  "sex": "M",
  "phone": "+51987654321",
  "country_id": 184,
  "region_id": 15,
  "province_id": 150,
  "district_id": 150101,
  "address": "Av. Principal 123",
  "specialty_id": 1,
  "career": "Ingeniería de Sistemas",
  "semester": "10",
  "experience_level": "intermedio",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

**Flujo en Frontend:**
1. Mostrar formulario con todos los campos
2. Validar que todos los campos requeridos estén completos
3. Enviar datos al endpoint
4. Mostrar mensaje de éxito
5. Redirigir a la siguiente etapa (evaluación)

---

### 📍 Paso 6: Iniciar Evaluación

**Endpoint:** `POST /api/convocatorias/{job_posting_id}/start-evaluation/`

**⚠️ IMPORTANTE:** Este endpoint asigna automáticamente una evaluación basada en:
- La especialidad del postulante (`specialty_id`)
- El nivel de experiencia (`experience_level`)

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request:** No requiere body

**Response:**
```json
{
  "message": "Evaluación asignada exitosamente",
  "evaluation_attempt": {
    "id": "uuid-attempt-id",
    "evaluation_id": "uuid-evaluation-id",
    "postulant_id": 1,
    "status": "in_progress",
    "started_at": "2025-01-01T00:00:00Z"
  },
  "evaluation": {
    "id": "uuid-evaluation-id",
    "title": "Evaluación de Desarrollo Web",
    "description": "Evaluación técnica"
  },
  "postulant_info": {
    "specialty": "Desarrollo Web",
    "experience_level": "intermedio"
  }
}
```

**Flujo en Frontend:**
1. Usuario hace clic en "Iniciar Evaluación"
2. Se envía la petición
3. Se muestra la evaluación asignada
4. Redirigir a la página de evaluación

---

### 📍 Paso 7: Obtener Preguntas de la Evaluación

**Endpoint:** `GET /api/evaluations/{evaluation_id}/view/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**
```json
{
  "id": "uuid-evaluation-id",
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "questions": [
    {
      "id": "uuid-question-id-1",
      "text": "¿Qué es React?",
      "type": "multiple_choice",
      "order": 1,
      "options": [
        {
          "id": "uuid-option-id-1",
          "text": "Una librería de JavaScript",
          "is_correct": true,
          "order": 1
        },
        {
          "id": "uuid-option-id-2",
          "text": "Un framework de Python",
          "is_correct": false,
          "order": 2
        }
      ]
    },
    {
      "id": "uuid-question-id-2",
      "text": "¿Qué es Django?",
      "type": "multiple_choice",
      "order": 2,
      "options": [
        {
          "id": "uuid-option-id-3",
          "text": "Un framework de Python",
          "is_correct": true,
          "order": 1
        },
        {
          "id": "uuid-option-id-4",
          "text": "Una base de datos",
          "is_correct": false,
          "order": 2
        }
      ]
    }
  ]
}
```

**Flujo en Frontend:**
1. Mostrar todas las preguntas con sus opciones
2. Permitir al usuario seleccionar una respuesta por pregunta
3. Guardar las respuestas (ver siguiente paso)

---

### 📍 Paso 8: Guardar Respuestas

Tienes dos opciones:

#### Opción A: Guardar Respuestas Individualmente

**Endpoint:** `POST /api/evaluation-attempts/{attempt_id}/answers/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request:**
```json
{
  "question_id": "uuid-question-id-1",
  "answer_option_id": "uuid-option-id-1"
}
```

**Response:**
```json
{
  "message": "Respuesta guardada exitosamente"
}
```

#### Opción B: Guardar Todas las Respuestas de una Vez (Recomendado)

**Endpoint:** `POST /api/evaluation-attempts/{attempt_id}/answers/batch/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request:**
```json
{
  "answers": [
    {
      "question_id": "uuid-question-id-1",
      "answer_option_id": "uuid-option-id-1"
    },
    {
      "question_id": "uuid-question-id-2",
      "answer_option_id": "uuid-option-id-3"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Respuestas guardadas exitosamente",
  "saved_count": 2
}
```

**Flujo en Frontend:**
1. Usuario responde todas las preguntas
2. Al hacer clic en "Finalizar Evaluación", guardar todas las respuestas
3. Mostrar confirmación
4. Redirigir a calificar (siguiente paso)

---

### 📍 Paso 9: Calificar Evaluación

**Endpoint:** `POST /api/evaluation-attempts/{attempt_id}/grade/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request:** No requiere body

**Response:**
```json
{
  "attempt_id": "uuid-attempt-id",
  "score": 85.5,
  "total_questions": 10,
  "correct_answers": 8,
  "status": "completed"
}
```

**Flujo en Frontend:**
1. Mostrar resultado de la evaluación
2. Mostrar puntaje, preguntas correctas, etc.
3. Permitir ver detalles de las respuestas
4. Redirigir al dashboard de progreso

---

### 📍 Paso 10: Ver Progreso

**Endpoint:** `GET /api/dashboard/postulants/my-progress/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**
```json
{
  "postulant_id": 1,
  "user_id": 1,
  "user_email": "postulante@example.com",
  "user_full_name": "Juan Pérez García",
  "job_posting_id": 1,
  "job_posting_title": "Convocatoria de Desarrollo Web",
  "total_percentage": 75.5,
  "completed_stages": 5,
  "total_stages": 7,
  "current_stage": "evaluation",
  "process_status": "in_progress",
  "stages_detail": [
    {
      "stage": "1. Personal Data",
      "completed": true,
      "percentage": 14.29,
      "completed_at": "2025-01-01T10:00:00Z"
    },
    {
      "stage": "2. Profile",
      "completed": true,
      "percentage": 14.29,
      "completed_at": "2025-01-01T11:00:00Z"
    },
    {
      "stage": "3. Technical",
      "completed": true,
      "percentage": 14.29,
      "completed_at": "2025-01-01T12:00:00Z"
    },
    {
      "stage": "4. Psychological",
      "completed": false,
      "percentage": 0,
      "completed_at": null
    },
    {
      "stage": "5. Motivation",
      "completed": false,
      "percentage": 0,
      "completed_at": null
    },
    {
      "stage": "6. CV",
      "completed": false,
      "percentage": 0,
      "completed_at": null
    },
    {
      "stage": "7. Confirmation",
      "completed": false,
      "percentage": 0,
      "completed_at": null
    }
  ],
  "next_stage": "4. Psychological",
  "can_advance": true,
  "specialty": {
    "id": 1,
    "name": "Desarrollo Web"
  },
  "career": "Ingeniería de Sistemas",
  "semester": "10",
  "experience_level": "intermedio"
}
```

**Flujo en Frontend:**
1. Mostrar dashboard con progreso general
2. Mostrar lista de etapas con estado (completada/pendiente)
3. Mostrar porcentaje de completitud
4. Mostrar próxima etapa a completar
5. Permitir navegar a cada etapa

---

### 📍 Paso 11: Subir CV (Opcional)

**Endpoint:** `POST /api/files/upload/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request (FormData):**
```javascript
const formData = new FormData();
formData.append('file', file); // Archivo PDF
formData.append('document_type', 'CV'); // Opcional
```

**Response:**
```json
{
  "id": 1,
  "filename": "cv.pdf",
  "file_url": "http://localhost:9000/documents/2025/11/cv.pdf",
  "document_type": "CV",
  "uploaded_at": "2025-01-01T00:00:00Z"
}
```

**Flujo en Frontend:**
1. Mostrar formulario de carga de archivo
2. Validar que sea PDF
3. Subir archivo
4. Mostrar confirmación
5. Actualizar progreso

---

### 📍 Paso 12: Ver Mis Documentos

**Endpoint:** `GET /api/files/my-documents/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "filename": "cv.pdf",
      "file_url": "http://localhost:9000/documents/2025/11/cv.pdf",
      "document_type": "CV",
      "uploaded_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

---

## 👨‍💼 FLUJO COMPLETO: ADMINISTRADOR

### 📍 Paso 1: Registro o Login

#### Opción A: Registro de Administrador

**Endpoint:** `POST /api/auth/register-admin/`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin",
  "paternal_lastname": "Sistema",
  "maternal_lastname": "Principal"
}
```

**Response:**
```json
{
  "message": "Administrador registrado exitosamente",
  "user": {
    "id": "b889d574-0e72-5717-be54-295d54482be5",
    "email": "admin@example.com",
    "username": "admin",
    "name": "Admin",
    "paternal_lastname": "Sistema",
    "maternal_lastname": "Principal",
    "role_id": 2,
    "provider": "email"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Opción B: Login

**Endpoint:** `POST /api/auth/login/`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "b889d574-0e72-5717-be54-295d54482be5",
    "email": "admin@example.com",
    "username": "admin",
    "name": "Admin",
    "paternal_lastname": "Sistema",
    "maternal_lastname": "Principal",
    "role_id": 2,
    "provider": "email"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE:** Verificar que `role_id === 2` para mostrar el panel de administrador.

---

### 📍 Paso 2: Dashboard Principal

**Endpoint:** `GET /api/dashboard/stats/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**
```json
{
  "total_users": 100,
  "total_postulants": 50,
  "total_convocatorias": 10,
  "active_convocatorias": 5
}
```

**Flujo en Frontend:**
1. Mostrar tarjetas con estadísticas generales
2. Mostrar gráficos (opcional)
3. Mostrar resumen de actividades recientes

---

### 📍 Paso 3: Gestionar Convocatorias

#### 3.1. Listar Todas las Convocatorias

**Endpoint:** `GET /api/convocatorias/`

**Query Parameters:**
- `page` (int, opcional): Número de página
- `page_size` (int, opcional): Tamaño de página
- `estado` (string, opcional): `"abierta"`, `"cerrada"`, `"finalizada"`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "title": "Convocatoria de Desarrollo Web",
      "description": "Buscamos desarrolladores web",
      "start_date": "2025-01-01T00:00:00Z",
      "end_date": "2025-12-31T23:59:59Z",
      "status": "abierta",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20
}
```

#### 3.2. Crear Nueva Convocatoria

**Endpoint:** `POST /api/convocatorias/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request:**
```json
{
  "title": "Convocatoria de Desarrollo Móvil",
  "description": "Buscamos desarrolladores móviles",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Convocatoria de Desarrollo Móvil",
  "description": "Buscamos desarrolladores móviles",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

#### 3.3. Ver Detalles de una Convocatoria

**Endpoint:** `GET /api/convocatorias/{convocatoria_id}/`

**Response:**
```json
{
  "id": 1,
  "title": "Convocatoria de Desarrollo Web",
  "description": "Buscamos desarrolladores web",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

#### 3.4. Actualizar Convocatoria

**Endpoint:** `PUT /api/convocatorias/{convocatoria_id}/` o `PATCH /api/convocatorias/{convocatoria_id}/`

**Request (PATCH - campos parciales):**
```json
{
  "status": "cerrada"
}
```

#### 3.5. Cerrar Convocatoria

**Endpoint:** `POST /api/convocatorias/{convocatoria_id}/cerrar`

**Response:**
```json
{
  "message": "Convocatoria cerrada exitosamente",
  "convocatoria": {
    "id": 1,
    "status": "cerrada"
  }
}
```

#### 3.6. Ver Estadísticas de una Convocatoria

**Endpoint:** `GET /api/dashboard/convocatorias/{convocatoria_id}/stats/`

**Response:**
```json
{
  "convocatoria_id": 1,
  "total_postulants": 20,
  "aceptados": 5,
  "rechazados": 2,
  "pendientes": 13
}
```

---

### 📍 Paso 4: Gestionar Postulantes

#### 4.1. Listar Postulantes

**Endpoint:** `GET /api/postulants/`

**Query Parameters:**
- `page` (int, opcional): Número de página
- `page_size` (int, opcional): Tamaño de página
- `job_posting_id` (int, opcional): Filtrar por convocatoria
- `state` (string, opcional): `"pendiente"`, `"aceptado"`, `"rechazado"`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "user_id": 1,
      "job_posting_id": 1,
      "state": "pendiente",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "page_size": 20
}
```

#### 4.2. Ver Detalles de un Postulante

**Endpoint:** `GET /api/postulants/{postulant_id}/`

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "job_posting_id": 1,
  "state": "pendiente",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### 4.3. Ver Datos Personales de un Postulante

**Endpoint:** `GET /api/postulants/{postulant_id}/personal-data/`

**Response:**
```json
{
  "id": 1,
  "postulant_id": 1,
  "document_type_id": 1,
  "document_number": "12345678",
  "birth_date": "1990-01-01",
  "sex": "M",
  "phone": "+51987654321",
  "country_id": 184,
  "region_id": 15,
  "province_id": 150,
  "district_id": 150101,
  "address": "Av. Principal 123",
  "specialty_id": 1,
  "career": "Ingeniería de Sistemas",
  "semester": "10",
  "experience_level": "intermedio"
}
```

#### 4.4. Ver Progreso de un Postulante

**Endpoint:** `GET /api/dashboard/postulants/{postulant_id}/progress/`

**Response:**
```json
{
  "postulant_id": 1,
  "total_percentage": 75.5,
  "completed_stages": 5,
  "total_stages": 7,
  "stages_detail": [
    {
      "stage": "1. Personal Data",
      "completed": true,
      "percentage": 14.29,
      "completed_at": "2025-01-01T10:00:00Z"
    }
  ],
  "next_stage": "4. Psychological"
}
```

#### 4.5. Aceptar Postulante

**Endpoint:** `POST /api/postulants/{postulant_id}/accept`

**Response:**
```json
{
  "message": "Postulante aceptado exitosamente",
  "postulant": {
    "id": 1,
    "state": "aceptado"
  }
}
```

#### 4.6. Rechazar Postulante

**Endpoint:** `POST /api/postulants/{postulant_id}/reject`

**Response:**
```json
{
  "message": "Postulante rechazado exitosamente",
  "postulant": {
    "id": 1,
    "state": "rechazado"
  }
}
```

#### 4.7. Ver Progreso de Todos los Postulantes de una Convocatoria

**Endpoint:** `GET /api/dashboard/convocatorias/{convocatoria_id}/postulants-progress/`

**Query Parameters:**
- `page` (int, opcional): Número de página
- `page_size` (int, opcional): Tamaño de página

**Response:**
```json
{
  "convocatoria_id": 1,
  "convocatoria_title": "Convocatoria de Desarrollo Web",
  "total_postulants": 20,
  "average_progress": 65.5,
  "postulants": [
    {
      "postulant_id": 1,
      "total_percentage": 75.5,
      "completed_stages": 5,
      "stages_detail": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 20,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  },
  "progress_distribution": {
    "0-25%": 2,
    "26-50%": 5,
    "51-75%": 8,
    "76-100%": 5
  }
}
```

---

### 📍 Paso 5: Gestionar Evaluaciones

#### 5.1. Listar Evaluaciones

**Endpoint:** `GET /api/evaluations/`

**Response:**
```json
{
  "results": [
    {
      "id": "uuid-evaluation-id",
      "job_posting_id": 1,
      "title": "Evaluación de Desarrollo Web",
      "description": "Evaluación técnica",
      "specialty_id": 1,
      "experience_level": "intermedio",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

#### 5.2. Crear Evaluación

**Endpoint:** `POST /api/evaluations/`

**Request:**
```json
{
  "job_posting_id": 1,
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "specialty_id": 1,
  "experience_level": "intermedio"
}
```

**Response:**
```json
{
  "id": "uuid-evaluation-id",
  "job_posting_id": 1,
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "specialty_id": 1,
  "experience_level": "intermedio",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### 5.3. Ver Detalles de una Evaluación

**Endpoint:** `GET /api/evaluations/{evaluation_id}/`

**Response:**
```json
{
  "id": "uuid-evaluation-id",
  "job_posting_id": 1,
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "specialty_id": 1,
  "experience_level": "intermedio",
  "questions": [
    {
      "id": "uuid-question-id",
      "text": "¿Qué es React?",
      "type": "multiple_choice",
      "options": [...]
    }
  ]
}
```

#### 5.4. Crear Pregunta

**Endpoint:** `POST /api/evaluations/{evaluation_id}/questions/`

**Request:**
```json
{
  "text": "¿Qué es React?",
  "type": "multiple_choice",
  "order": 1
}
```

**Response:**
```json
{
  "id": "uuid-question-id",
  "evaluation_id": "uuid-evaluation-id",
  "text": "¿Qué es React?",
  "type": "multiple_choice",
  "order": 1,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### 5.5. Crear Opción de Respuesta

**Endpoint:** `POST /api/questions/{question_id}/options/`

**Request:**
```json
{
  "text": "Una librería de JavaScript",
  "is_correct": true,
  "order": 1
}
```

**Response:**
```json
{
  "id": "uuid-option-id",
  "question_id": "uuid-question-id",
  "text": "Una librería de JavaScript",
  "is_correct": true,
  "order": 1,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### 5.6. Actualizar Pregunta

**Endpoint:** `PUT /api/questions/{question_id}/` o `PATCH /api/questions/{question_id}/`

#### 5.7. Eliminar Pregunta

**Endpoint:** `DELETE /api/questions/{question_id}/`

---

### 📍 Paso 6: Gestionar Usuarios

#### 6.1. Listar Usuarios

**Endpoint:** `GET /api/users/`

**Query Parameters:**
- `page` (int, opcional): Número de página
- `page_size` (int, opcional): Tamaño de página
- `search` (string, opcional): Búsqueda por email, username, name
- `is_active` (boolean, opcional): Filtrar por estado
- `role_id` (int, opcional): Filtrar por rol (1=Postulante, 2=Admin)

**Response:**
```json
{
  "results": [
    {
      "id": "uuid-user-id",
      "email": "user@example.com",
      "username": "username",
      "name": "Juan",
      "paternal_lastname": "Pérez",
      "maternal_lastname": "García",
      "role_id": 1,
      "is_active": true
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

#### 6.2. Crear Usuario

**Endpoint:** `POST /api/users/`

**Request:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "password123",
  "name": "Nuevo",
  "paternal_lastname": "Usuario",
  "maternal_lastname": "Test",
  "role_id": 1,
  "is_active": true
}
```

#### 6.3. Ver Detalles de un Usuario

**Endpoint:** `GET /api/users/{user_id}/`

#### 6.4. Actualizar Usuario

**Endpoint:** `PUT /api/users/{user_id}/` o `PATCH /api/users/{user_id}/`

#### 6.5. Eliminar Usuario

**Endpoint:** `DELETE /api/users/{user_id}/`

#### 6.6. Cambiar Rol de Usuario

**Endpoint:** `POST /api/users/{user_id}/change-role/`

**Request:**
```json
{
  "role_id": 2
}
```

---

### 📍 Paso 7: Gestionar Especialidades

#### 7.1. Listar Especialidades

**Endpoint:** `GET /api/specialties/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Desarrollo Web",
      "description": "Especialidad en desarrollo web",
      "is_active": true
    }
  ],
  "total": 10
}
```

#### 7.2. Crear Especialidad

**Endpoint:** `POST /api/specialties/`

**Request:**
```json
{
  "name": "Desarrollo Móvil",
  "description": "Especialidad en desarrollo móvil"
}
```

#### 7.3. Actualizar Especialidad

**Endpoint:** `PUT /api/specialties/{specialty_id}/` o `PATCH /api/specialties/{specialty_id}/`

#### 7.4. Eliminar Especialidad

**Endpoint:** `DELETE /api/specialties/{specialty_id}/`

---

### 📍 Paso 8: Gestionar Tipos de Documento

#### 8.1. Listar Tipos de Documento

**Endpoint:** `GET /api/document-types/`

#### 8.2. Crear Tipo de Documento

**Endpoint:** `POST /api/document-types/`

**Request:**
```json
{
  "name": "Carné de Extranjería",
  "description": "Carné de Extranjería"
}
```

#### 8.3. Actualizar Tipo de Documento

**Endpoint:** `PUT /api/document-types/{document_type_id}/` o `PATCH /api/document-types/{document_type_id}/`

#### 8.4. Eliminar Tipo de Documento

**Endpoint:** `DELETE /api/document-types/{document_type_id}/`

---

### 📍 Paso 9: Ver Estadísticas Avanzadas

#### 9.1. Progreso Promedio General

**Endpoint:** `GET /api/dashboard/postulants/average-progress/`

**Query Parameters:**
- `job_posting_id` (int, opcional): Filtrar por convocatoria

**Response:**
```json
{
  "overall_average": 65.5,
  "by_convocatoria": [
    {
      "convocatoria_id": 1,
      "convocatoria_title": "Convocatoria de Desarrollo Web",
      "total_postulants": 20,
      "average_progress": 70.5,
      "completed_count": 5,
      "in_progress_count": 10,
      "not_started_count": 5
    }
  ],
  "by_stage": [
    {
      "stage": "1. Personal Data",
      "completion_rate": 85.5,
      "completed_count": 17,
      "total_count": 20
    }
  ],
  "progress_distribution": {
    "0-25%": 2,
    "26-50%": 5,
    "51-75%": 8,
    "76-100%": 5
  },
  "by_specialty": [
    {
      "specialty_id": 1,
      "specialty_name": "Desarrollo Web",
      "total_postulants": 10,
      "average_progress": 75.5
    }
  ]
}
```

#### 9.2. Actividad de Usuarios

**Endpoint:** `GET /api/dashboard/users/activity/`

**Response:**
```json
{
  "recent_logins": [
    {
      "user_id": 1,
      "email": "user@example.com",
      "last_login": "2025-01-01T12:00:00Z"
    }
  ],
  "total_active_users": 50,
  "total_inactive_users": 10
}
```

---

## 🔄 Manejo de Errores Comunes

### Token Expirado

**Error:** `401 Unauthorized`

**Solución:** Renovar el token usando el refresh token:

**Endpoint:** `POST /api/auth/refresh/`

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Implementación en Frontend:**
```javascript
// Interceptor para renovar token automáticamente
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh/', {
            refresh: refreshToken
          });
          localStorage.setItem('access_token', data.access);
          error.config.headers.Authorization = `Bearer ${data.access}`;
          return axios.request(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

### Usuario No Autenticado

**Error:** `401 Unauthorized` con mensaje "Authentication credentials were not provided"

**Solución:** Redirigir al login y guardar la URL actual para redirigir después del login.

---

### Permisos Insuficientes

**Error:** `403 Forbidden` con mensaje "Solo administradores pueden..."

**Solución:** Verificar el `role_id` del usuario antes de mostrar opciones de administrador.

---

### Recurso No Encontrado

**Error:** `404 Not Found`

**Solución:** Verificar que el ID sea correcto y que el recurso exista.

---

## 📝 Notas Importantes

1. **Tokens:** Siempre guardar y usar los tokens correctamente. El access token expira, usar refresh token para renovarlo.

2. **Permisos:** Verificar `role_id` antes de mostrar funcionalidades:
   - `role_id === 1`: Postulante
   - `role_id === 2`: Administrador

3. **Select en Cascada:** Siempre usar `country_id = 184` para Perú.

4. **Datos Personales:** El endpoint `/api/postulants/me/personal-data/` usa automáticamente el usuario autenticado.

5. **Evaluaciones:** Usar `/api/convocatorias/{job_posting_id}/start-evaluation/` para asignación automática basada en especialidad y experiencia.

6. **Paginación:** Todos los endpoints de listado soportan `page` y `page_size`.

7. **Fechas:** Usar formato ISO 8601: `"2025-01-01T00:00:00Z"`.

---

## ✅ Checklist de Implementación

### Postulante
- [ ] Login/Registro
- [ ] Ver convocatorias
- [ ] Postularse a convocatoria
- [ ] Cargar datos para formulario (tipos de documento, especialidades, datos geográficos)
- [ ] Completar datos personales
- [ ] Iniciar evaluación
- [ ] Ver preguntas
- [ ] Guardar respuestas
- [ ] Calificar evaluación
- [ ] Ver progreso
- [ ] Subir CV (opcional)

### Administrador
- [ ] Login/Registro
- [ ] Dashboard principal
- [ ] Gestionar convocatorias (CRUD)
- [ ] Gestionar postulantes (listar, ver detalles, aceptar/rechazar)
- [ ] Ver progreso de postulantes
- [ ] Gestionar evaluaciones (CRUD)
- [ ] Crear preguntas y opciones
- [ ] Gestionar usuarios (CRUD)
- [ ] Gestionar especialidades (CRUD)
- [ ] Gestionar tipos de documento (CRUD)
- [ ] Ver estadísticas avanzadas

---

**¡Éxito con la implementación! 🎉**

