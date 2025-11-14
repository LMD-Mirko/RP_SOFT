# 📋 Endpoints Faltantes - Documentación COMPLETA para Frontend

Este documento contiene **TODOS** los endpoints que faltan en el `README_FRONTEND.md`. Úsalo como complemento para tener la documentación completa.

**Base URL:** `http://localhost:5173/api/`

**⚠️ IMPORTANTE:** Este documento incluye TODOS los endpoints del sistema. Algunos ya están en README_FRONTEND.md pero se incluyen aquí para tener una referencia completa.

**
---

## 👤 Usuarios - Endpoints Faltantes

### 1. Verificar Email

**Endpoint:** `POST /api/users/me/verify-email/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:** (Vacío)

**Response 200 (Success):**
```json
{
  "message": "Código de verificación enviado a tu email"
}
```

---

### 2. Confirmar Verificación de Email

**Endpoint:** `POST /api/users/me/verify-email/confirm/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Response 200 (Success):**
```json
{
  "message": "Email verificado exitosamente"
}
```

---

### 3. Actualizar Foto de Perfil

**Endpoint:** `PATCH /api/users/me/photo/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('photo', file); // Archivo de imagen
```

**Response 200 (Success):**
```json
{
  "message": "Foto actualizada exitosamente",
  "photo_url": "http://localhost:9000/photos/user_photo.jpg"
}
```

---

### 4. Obtener Actividad del Usuario

**Endpoint:** `GET /api/users/me/activity/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "activities": [
    {
      "action": "profile_updated",
      "description": "Perfil actualizado",
      "timestamp": "2025-01-01T00:00:00Z"
    },
    {
      "action": "email_verified",
      "description": "Email verificado",
      "timestamp": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 2
}
```

---

### 5. Cambiar Rol de Usuario (Solo Admin)

**Endpoint:** `POST /api/users/{user_id}/change-role/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "role_id": 2
}
```

**Response 200 (Success):**
```json
{
  "message": "Rol de usuario actualizado exitosamente",
  "user_id": 1,
  "role_id": 2,
  "role_name": "Admin"
}
```

---

## 🎭 Roles - TODOS los Endpoints

### 1. Listar Roles (Solo Admin)

**Endpoint:** `GET /api/roles/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Postulante",
      "slug": "postulante",
      "description": "Rol de postulante",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Admin",
      "slug": "admin",
      "description": "Rol de administrador",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Crear Rol (Solo Admin)

**Endpoint:** `POST /api/roles/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "id": 3,
  "name": "Moderador",
  "slug": "moderador",
  "description": "Rol de moderador",
  "is_active": true
}
```

**Response 201 (Success):**
```json
{
  "id": 3,
  "name": "Moderador",
  "slug": "moderador",
  "description": "Rol de moderador",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. Obtener Rol por ID (Solo Admin)

**Endpoint:** `GET /api/roles/{role_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "name": "Postulante",
  "slug": "postulante",
  "description": "Rol de postulante",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 4. Actualizar Rol (Solo Admin)

**Endpoint:** `PATCH /api/roles/{role_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "name": "Postulante Actualizado",
  "description": "Nueva descripción",
  "is_active": true
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "name": "Postulante Actualizado",
  "slug": "postulante",
  "description": "Nueva descripción",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

## 📋 Postulantes - Endpoints Faltantes

### 1. Obtener/Guardar Respuestas de Encuesta

**Endpoint:** `GET /api/postulants/{postulant_id}/survey-responses/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": "uuid-survey-response-id",
      "postulant_id": 1,
      "survey_type": "pre_evaluation",
      "responses_json": {
        "question1": "answer1",
        "question2": "answer2"
      },
      "calculated_score": 85.5,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Obtener Respuesta de Encuesta Específica

**Endpoint:** `GET /api/postulants/{postulant_id}/survey-responses/{tipo_encuesta}/`

**Query Parameters:**
- `tipo_encuesta` (string): Tipo de encuesta (ej: `"pre_evaluation"`, `"post_evaluation"`)

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-survey-response-id",
  "postulant_id": 1,
  "survey_type": "pre_evaluation",
  "responses_json": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "calculated_score": 85.5,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. Crear/Actualizar Respuesta de Encuesta

**Endpoint:** `POST /api/postulants/{postulant_id}/survey-responses/` o `PATCH /api/postulants/{postulant_id}/survey-responses/{tipo_encuesta}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "survey_type": "pre_evaluation",
  "responses_json": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "calculated_score": 85.5
}
```

**Response 200/201 (Success):**
```json
{
  "id": "uuid-survey-response-id",
  "postulant_id": 1,
  "survey_type": "pre_evaluation",
  "responses_json": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "calculated_score": 85.5,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

## 📄 Tipos de Documento - CRUD Completo

### 1. Obtener Tipo de Documento por ID (Solo Admin)

**Endpoint:** `GET /api/document-types/{document_type_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "name": "DNI",
  "description": "Documento Nacional de Identidad",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Actualizar Tipo de Documento (Solo Admin)

**Endpoint:** `PUT /api/document-types/{document_type_id}/` o `PATCH /api/document-types/{document_type_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "name": "DNI Actualizado",
  "description": "Nueva descripción",
  "is_active": true
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "name": "DNI Actualizado",
  "description": "Nueva descripción",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. Eliminar Tipo de Documento (Solo Admin)

**Endpoint:** `DELETE /api/document-types/{document_type_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

## 🎯 Especialidades - CRUD Completo

### 1. Obtener Especialidad por ID

**Endpoint:** `GET /api/specialties/{specialty_id}/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "id": 1,
  "name": "Frontend Development",
  "description": "Desarrollo de interfaces de usuario",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Actualizar Especialidad (Solo Admin)

**Endpoint:** `PUT /api/specialties/{specialty_id}/` o `PATCH /api/specialties/{specialty_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "name": "Frontend Development Actualizado",
  "description": "Nueva descripción",
  "is_active": true
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "name": "Frontend Development Actualizado",
  "description": "Nueva descripción",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. Eliminar Especialidad (Solo Admin)

**Endpoint:** `DELETE /api/specialties/{specialty_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

## 📝 Evaluaciones - Endpoints Faltantes

### 1. Obtener Evaluación con Preguntas (Solo Admin)

**Endpoint:** `GET /api/evaluations/{evaluation_id}/?include_questions=true`

**Query Parameters:**
- `include_questions` (boolean, opcional): Incluir preguntas en la respuesta

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-evaluation-id",
  "job_posting_id": 1,
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "specialty_id": 1,
  "experience_level": "intermedio",
  "is_active": true,
  "questions": [
    {
      "id": "uuid-question-id",
      "text": "¿Qué es React?",
      "type": "multiple_choice",
      "order": 1,
      "options": [
        {
          "id": "uuid-option-id",
          "text": "Una librería de JavaScript",
          "is_correct": true,
          "order": 1
        }
      ]
    }
  ],
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Actualizar Evaluación (Solo Admin)

**Endpoint:** `PUT /api/evaluations/{evaluation_id}/` o `PATCH /api/evaluations/{evaluation_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "title": "Evaluación Actualizada",
  "description": "Nueva descripción",
  "specialty_id": 1,
  "experience_level": "avanzado",
  "is_active": true
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-evaluation-id",
  "job_posting_id": 1,
  "title": "Evaluación Actualizada",
  "description": "Nueva descripción",
  "specialty_id": 1,
  "experience_level": "avanzado",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. Eliminar Evaluación (Solo Admin)

**Endpoint:** `DELETE /api/evaluations/{evaluation_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

### 4. Crear Pregunta en Evaluación (Solo Admin)

**Endpoint:** `POST /api/evaluations/{evaluation_id}/questions/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "text": "¿Qué es React?",
  "type": "multiple_choice",
  "order": 1
}
```

**Response 201 (Success):**
```json
{
  "id": "uuid-question-id",
  "evaluation_id": "uuid-evaluation-id",
  "text": "¿Qué es React?",
  "type": "multiple_choice",
  "order": 1,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 5. Obtener Pregunta por ID (Solo Admin)

**Endpoint:** `GET /api/questions/{question_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-question-id",
  "evaluation_id": "uuid-evaluation-id",
  "text": "¿Qué es React?",
  "type": "multiple_choice",
  "order": 1,
  "options": [
    {
      "id": "uuid-option-id",
      "text": "Una librería de JavaScript",
      "is_correct": true,
      "order": 1
    }
  ],
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 6. Actualizar Pregunta (Solo Admin)

**Endpoint:** `PUT /api/questions/{question_id}/` o `PATCH /api/questions/{question_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "text": "¿Qué es React? (Actualizado)",
  "type": "multiple_choice",
  "order": 2
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-question-id",
  "evaluation_id": "uuid-evaluation-id",
  "text": "¿Qué es React? (Actualizado)",
  "type": "multiple_choice",
  "order": 2,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 7. Eliminar Pregunta (Solo Admin)

**Endpoint:** `DELETE /api/questions/{question_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

### 8. Crear Opción de Respuesta (Solo Admin)

**Endpoint:** `POST /api/questions/{question_id}/options/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "text": "Una librería de JavaScript",
  "is_correct": true,
  "order": 1
}
```

**Response 201 (Success):**
```json
{
  "id": "uuid-option-id",
  "question_id": "uuid-question-id",
  "text": "Una librería de JavaScript",
  "is_correct": true,
  "order": 1,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 9. Obtener Opción de Respuesta por ID (Solo Admin)

**Endpoint:** `GET /api/answer-options/{answer_option_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-option-id",
  "question_id": "uuid-question-id",
  "text": "Una librería de JavaScript",
  "is_correct": true,
  "order": 1,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 10. Actualizar Opción de Respuesta (Solo Admin)

**Endpoint:** `PUT /api/answer-options/{answer_option_id}/` o `PATCH /api/answer-options/{answer_option_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "text": "Una librería de JavaScript (Actualizado)",
  "is_correct": false,
  "order": 2
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-option-id",
  "question_id": "uuid-question-id",
  "text": "Una librería de JavaScript (Actualizado)",
  "is_correct": false,
  "order": 2,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 11. Eliminar Opción de Respuesta (Solo Admin)

**Endpoint:** `DELETE /api/answer-options/{answer_option_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

## 📊 Dashboard - Endpoints Faltantes

### 1. Actividad de Usuarios (Solo Admin)

**Endpoint:** `GET /api/dashboard/users/activity/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `user_id` (int, opcional): Filtrar por usuario
- `action` (string, opcional): Filtrar por acción

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "user_id": 1,
      "user_email": "user@example.com",
      "action": "profile_updated",
      "description": "Perfil actualizado",
      "timestamp": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

---

### 2. Progreso de Postulantes por Convocatoria (Solo Admin)

**Endpoint:** `GET /api/dashboard/convocatorias/{convocatoria_id}/postulants-progress/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "convocatoria_id": 1,
  "postulants": [
    {
      "postulant_id": 1,
      "user_id": 1,
      "overall_progress": 75.5,
      "stages": {
        "registration": {
          "completed": true,
          "progress": 100
        },
        "personal_data": {
          "completed": true,
          "progress": 100
        },
        "evaluation": {
          "completed": false,
          "progress": 50
        },
        "final": {
          "completed": false,
          "progress": 0
        }
      }
    }
  ],
  "total": 10
}
```

---

## 📁 Archivos - Endpoints Faltantes

### 1. Obtener URL de Descarga de Documento

**Endpoint:** `GET /api/files/{document_id}/download/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "download_url": "http://localhost:9000/documents/2025/11/documento.pdf?signature=...",
  "expires_in": 3600
}
```

---

## 🔄 Convocatorias - Endpoints Faltantes

### 1. Actualizar Convocatoria (Solo Admin)

**Endpoint:** `PUT /api/convocatorias/{convocatoria_id}/` o `PATCH /api/convocatorias/{convocatoria_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "title": "Convocatoria Actualizada",
  "description": "Nueva descripción",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "title": "Convocatoria Actualizada",
  "description": "Nueva descripción",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Eliminar Convocatoria (Solo Admin)

**Endpoint:** `DELETE /api/convocatorias/{convocatoria_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

## 📝 Evaluaciones - Intentos - Endpoints Faltantes

### 1. Obtener Intento por ID

**Endpoint:** `GET /api/evaluation-attempts/{attempt_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-attempt-id",
  "evaluation_id": "uuid-evaluation-id",
  "postulant_id": 1,
  "status": "completed",
  "score": 85.5,
  "started_at": "2025-01-01T00:00:00Z",
  "completed_at": "2025-01-01T01:00:00Z",
  "answers": [
    {
      "id": "uuid-answer-id",
      "question_id": "uuid-question-id",
      "answer_option_id": "uuid-option-id",
      "is_correct": true
    }
  ]
}
```

---

## 📝 Evaluaciones - Intentos - Endpoints Adicionales

### 1. Iniciar Intento de Evaluación Manual

**Endpoint:** `POST /api/evaluations/{evaluation_id}/start/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 201 (Success):**
```json
{
  "id": "uuid-attempt-id",
  "evaluation_id": "uuid-evaluation-id",
  "user_id": 1,
  "status": "in_progress",
  "started_at": "2025-01-01T00:00:00Z",
  "completed_at": null,
  "score": null
}
```

---

### 2. Obtener Evaluación para Postulante (Sin Respuestas Correctas)

**Endpoint:** `GET /api/evaluations/{evaluation_id}/view/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "uuid-evaluation-id",
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "questions": [
    {
      "id": "uuid-question-id",
      "text": "¿Qué es React?",
      "order": 1,
      "options": [
        {
          "id": "uuid-option-id",
          "text": "Una librería de JavaScript",
          "order": 1
        }
      ]
    }
  ]
}
```

**⚠️ NOTA:** Este endpoint NO incluye `is_correct` en las opciones para postulantes.

---

### 3. Obtener Intento Activo

**Endpoint:** `GET /api/evaluations/{evaluation_id}/attempt/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "attempt": {
    "id": "uuid-attempt-id",
    "evaluation_id": "uuid-evaluation-id",
    "user_id": 1,
    "status": "in_progress",
    "started_at": "2025-01-01T00:00:00Z"
  },
  "answers": [
    {
      "id": "uuid-answer-id",
      "question_id": "uuid-question-id",
      "selected_option_id": "uuid-option-id"
    }
  ]
}
```

---

### 4. Listar Mis Intentos

**Endpoint:** `GET /api/evaluation-attempts/me/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `status` (string, opcional): Filtrar por estado (`in_progress`, `completed`)

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": "uuid-attempt-id",
      "evaluation_id": "uuid-evaluation-id",
      "user_id": 1,
      "status": "completed",
      "score": 85.5,
      "started_at": "2025-01-01T00:00:00Z",
      "completed_at": "2025-01-01T01:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20
}
```

---

### 5. Guardar Respuesta Individual

**Endpoint:** `POST /api/evaluation-attempts/{attempt_id}/answers/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "question_id": "uuid-question-id",
  "selected_option_id": "uuid-option-id"
}
```

**Response 201 (Success):**
```json
{
  "id": "uuid-answer-id",
  "question_id": "uuid-question-id",
  "selected_option_id": "uuid-option-id",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 6. Guardar Respuestas en Lote

**Endpoint:** `POST /api/evaluation-attempts/{attempt_id}/answers/batch/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "uuid-question-id-1",
      "selected_option_id": "uuid-option-id-1"
    },
    {
      "question_id": "uuid-question-id-2",
      "selected_option_id": "uuid-option-id-2"
    }
  ]
}
```

**Response 201 (Success):**
```json
{
  "answers": [
    {
      "id": "uuid-answer-id-1",
      "question_id": "uuid-question-id-1",
      "selected_option_id": "uuid-option-id-1"
    },
    {
      "id": "uuid-answer-id-2",
      "question_id": "uuid-question-id-2",
      "selected_option_id": "uuid-option-id-2"
    }
  ]
}
```

---

### 7. Calificar Intento

**Endpoint:** `POST /api/evaluation-attempts/{attempt_id}/grade/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "attempt": {
    "id": "uuid-attempt-id",
    "evaluation_id": "uuid-evaluation-id",
    "status": "completed",
    "score": 85.5,
    "completed_at": "2025-01-01T01:00:00Z"
  },
  "answers": [
    {
      "id": "uuid-answer-id",
      "question_id": "uuid-question-id",
      "selected_option_id": "uuid-option-id",
      "is_correct": true
    }
  ],
  "message": "Evaluación calificada exitosamente"
}
```

---

## 👤 Usuarios - Endpoints Adicionales

### 1. Listar Usuarios (Solo Admin)

**Endpoint:** `GET /api/users/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `search` (string, opcional): Búsqueda por email, username, name
- `is_active` (boolean, opcional): Filtrar por estado
- `role_id` (int, opcional): Filtrar por rol (1=Postulante, 2=Admin)

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "name": "Juan",
      "paternal_lastname": "Pérez",
      "maternal_lastname": "García",
      "role_id": 1,
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```

---

### 2. Crear Usuario (Solo Admin)

**Endpoint:** `POST /api/users/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
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

**Response 201 (Success):**
```json
{
  "id": 1,
  "email": "newuser@example.com",
  "username": "newuser",
  "name": "Nuevo",
  "paternal_lastname": "Usuario",
  "maternal_lastname": "Test",
  "role_id": 1,
  "is_active": true
}
```

---

### 3. Obtener Usuario por ID (Solo Admin)

**Endpoint:** `GET /api/users/{user_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "role_id": 1,
  "is_active": true,
  "document_type_id": 1,
  "document_type_name": "DNI",
  "document_number": "12345678",
  "country_id": 184,
  "country_name": "Perú",
  "region_id": 15,
  "region_name": "Lima",
  "province_id": 150,
  "province_name": "Lima",
  "district_id": 150101,
  "district_name": "Lima"
}
```

---

### 4. Actualizar Usuario (Solo Admin)

**Endpoint:** `PUT /api/users/{user_id}/` o `PATCH /api/users/{user_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "username": "updateduser",
  "name": "Actualizado",
  "paternal_lastname": "Usuario",
  "maternal_lastname": "Test",
  "role_id": 1,
  "is_active": true,
  "password": "newpassword123"
}
```

**Response 200 (Success):**
```json
{
  "message": "Usuario actualizado exitosamente",
  "user": {
    "id": 1,
    "email": "updated@example.com",
    "username": "updateduser",
    "name": "Actualizado",
    "role_id": 1,
    "is_active": true
  }
}
```

---

### 5. Eliminar Usuario (Solo Admin)

**Endpoint:** `DELETE /api/users/{user_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

---

## 📋 Postulantes - Endpoints Adicionales

### 1. Listar Postulantes (Solo Admin)

**Endpoint:** `GET /api/postulants/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `job_posting_id` (int, opcional): Filtrar por convocatoria
- `user_id` (string, opcional): Filtrar por usuario (solo admins)
- `process_status` (string, opcional): Filtrar por estado del proceso

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "user_id": 1,
      "user_document_type_id": 1,
      "user_document_type_name": "DNI",
      "user_document_number": "12345678",
      "user_country_id": 184,
      "user_country_name": "Perú",
      "user_region_id": 15,
      "user_region_name": "Lima",
      "user_province_id": 150,
      "user_province_name": "Lima",
      "user_district_id": 150101,
      "user_district_name": "Lima",
      "job_posting_id": 1,
      "process_status": "pendiente",
      "current_stage": "registration",
      "registration_date": "2025-01-01T00:00:00Z",
      "accepted": false
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 50,
    "total_pages": 3,
    "has_next": true,
    "has_previous": false
  }
}
```

---

### 2. Crear Postulante

**Endpoint:** `POST /api/postulants/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "job_posting_id": 1
}
```

**Response 201 (Success):**
```json
{
  "id": 1,
  "user_id": 1,
  "job_posting_id": 1,
  "process_status": "pendiente",
  "current_stage": "registration",
  "registration_date": "2025-01-01T00:00:00Z",
  "accepted": false
}
```

---

### 3. Obtener Postulante por ID

**Endpoint:** `GET /api/postulants/{postulant_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "user_id": 1,
  "job_posting_id": 1,
  "process_status": "pendiente",
  "current_stage": "registration",
  "registration_date": "2025-01-01T00:00:00Z",
  "accepted": false
}
```

---

### 4. Actualizar Postulante

**Endpoint:** `PATCH /api/postulants/{postulant_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "process_status": "en_proceso",
  "current_stage": "evaluation"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "user_id": 1,
  "job_posting_id": 1,
  "process_status": "en_proceso",
  "current_stage": "evaluation",
  "accepted": false
}
```

---

### 5. Eliminar Postulante (Solo Admin)

**Endpoint:** `DELETE /api/postulants/{postulant_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "message": "Postulante eliminado correctamente"
}
```

---

### 6. Obtener Datos Personales (Con ID)

**Endpoint:** `GET /api/postulants/{postulant_id}/personal-data/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "postulant_id": 1,
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "document_number": "12345678",
  "phone": "+51987654321",
  "birth_date": "1990-01-01",
  "district": "Lima",
  "address": "Av. Principal 123",
  "specialty": {
    "id": 1,
    "name": "Frontend Development"
  },
  "career": "Ingeniería de Sistemas",
  "semester": "10",
  "experience_level": "intermedio"
}
```

---

### 7. Crear/Actualizar Datos Personales (Con ID)

**Endpoint:** `POST /api/postulants/{postulant_id}/personal-data/` o `PATCH /api/postulants/{postulant_id}/personal-data/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "document_number": "12345678",
  "phone": "+51987654321",
  "birth_date": "1990-01-01",
  "district": "Lima",
  "address": "Av. Principal 123",
  "specialty_id": 1,
  "career": "Ingeniería de Sistemas",
  "semester": "10",
  "experience_level": "intermedio"
}
```

---

## 📊 Dashboard - Endpoints Adicionales

### 1. Estadísticas Generales (Solo Admin)

**Endpoint:** `GET /api/dashboard/stats/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "total_users": 100,
  "total_postulants": 50,
  "total_convocatorias": 10,
  "active_convocatorias": 5
}
```

---

### 2. Estadísticas de Convocatoria (Solo Admin)

**Endpoint:** `GET /api/dashboard/convocatorias/{convocatoria_id}/stats/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
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

### 3. Mi Progreso (Postulante)

**Endpoint:** `GET /api/dashboard/postulants/my-progress/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "postulant_id": 1,
  "overall_progress": 75.5,
  "stages": {
    "registration": {
      "completed": true,
      "progress": 100
    },
    "personal_data": {
      "completed": true,
      "progress": 100
    },
    "evaluation": {
      "completed": false,
      "progress": 50
    },
    "final": {
      "completed": false,
      "progress": 0
    }
  }
}
```

---

### 4. Progreso de Postulante (Solo Admin)

**Endpoint:** `GET /api/dashboard/postulants/{postulant_id}/progress/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "postulant_id": 1,
  "overall_progress": 75.5,
  "stages": {
    "registration": {
      "completed": true,
      "progress": 100
    },
    "personal_data": {
      "completed": true,
      "progress": 100
    },
    "evaluation": {
      "completed": false,
      "progress": 50
    },
    "final": {
      "completed": false,
      "progress": 0
    }
  }
}
```

---

### 5. Progreso Promedio (Solo Admin)

**Endpoint:** `GET /api/dashboard/postulants/average-progress/`

**Query Parameters:**
- `job_posting_id` (int, opcional): Filtrar por convocatoria

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "average_progress": 65.5,
  "total_postulants": 50,
  "by_stage": {
    "registration": 90.0,
    "personal_data": 75.0,
    "evaluation": 50.0,
    "final": 25.0
  }
}
```

---

## 📁 Archivos - Endpoints Adicionales

### 1. Subir Documento

**Endpoint:** `POST /api/files/upload/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('document_type', 'CV');
formData.append('postulant_id', 1); // Opcional
formData.append('description', 'Mi CV'); // Opcional
```

**Response 201 (Success):**
```json
{
  "id": 1,
  "document_type": "CV",
  "original_filename": "cv.pdf",
  "file_size": 1024000,
  "mime_type": "application/pdf",
  "description": "Mi CV",
  "created_at": "2025-01-01T00:00:00Z",
  "message": "Archivo subido exitosamente"
}
```

---

### 2. Listar Mis Documentos

**Endpoint:** `GET /api/files/my-documents/`

**Query Parameters:**
- `document_type` (string, opcional): Filtrar por tipo de documento

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "user_id": 1,
      "postulant_id": 1,
      "document_type": "CV",
      "original_filename": "cv.pdf",
      "file_size": 1024000,
      "mime_type": "application/pdf",
      "description": "Mi CV",
      "is_verified": false,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

---

### 3. Eliminar Documento

**Endpoint:** `DELETE /api/files/{document_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "message": "Documento eliminado exitosamente"
}
```

---

## 🔄 Convocatorias - Endpoints Adicionales

### 1. Listar Convocatorias (Público)

**Endpoint:** `GET /api/convocatorias/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `status` o `estado` (string, opcional): Filtrar por estado (`abierta`, `cerrada`, `finalizada`)

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "title": "Convocatoria de Desarrollo",
      "description": "Buscamos desarrolladores",
      "start_date": "2025-01-01T00:00:00Z",
      "end_date": "2025-12-31T23:59:59Z",
      "status": "abierta",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 10,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  }
}
```

---

### 2. Obtener Convocatoria por ID (Público)

**Endpoint:** `GET /api/convocatorias/{convocatoria_id}/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "id": 1,
  "title": "Convocatoria de Desarrollo",
  "description": "Buscamos desarrolladores",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. Crear Convocatoria (Solo Admin)

**Endpoint:** `POST /api/convocatorias/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "title": "Convocatoria de Desarrollo",
  "description": "Buscamos desarrolladores",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta"
}
```

**Response 201 (Success):**
```json
{
  "id": 1,
  "title": "Convocatoria de Desarrollo",
  "description": "Buscamos desarrolladores",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z",
  "status": "abierta",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 4. Cerrar Convocatoria (Solo Admin)

**Endpoint:** `POST /api/convocatorias/{convocatoria_id}/cerrar`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "title": "Convocatoria de Desarrollo",
  "status": "cerrada",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 5. Iniciar Evaluación Automática por Convocatoria

**Endpoint:** `POST /api/convocatorias/{job_posting_id}/start-evaluation/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "attempt_id": 1,
  "evaluation_id": "uuid-evaluation-id",
  "evaluation_title": "Evaluación de Desarrollo Web",
  "specialty": {
    "id": 1,
    "name": "Frontend Development"
  },
  "experience_level": "intermedio",
  "status": "in_progress",
  "started_at": "2025-01-01T00:00:00Z",
  "user_id": 1,
  "job_posting_id": 1
}
```

---

## 📝 Evaluaciones - Endpoints Adicionales

### 1. Listar Evaluaciones (Solo Admin)

**Endpoint:** `GET /api/evaluations/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `job_posting_id` (int, opcional): Filtrar por convocatoria
- `is_active` (boolean, opcional): Filtrar por estado activo

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
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
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20
}
```

---

### 2. Crear Evaluación (Solo Admin)

**Endpoint:** `POST /api/evaluations/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "job_posting_id": 1,
  "specialty_id": 1,
  "experience_level": "intermedio",
  "is_active": true
}
```

**Response 201 (Success):**
```json
{
  "id": "uuid-evaluation-id",
  "job_posting_id": 1,
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "specialty_id": 1,
  "experience_level": "intermedio",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

## 📄 Tipos de Documento - Endpoints Adicionales

### 1. Listar Tipos de Documento (Público)

**Endpoint:** `GET /api/document-types/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "DNI",
      "description": "Documento Nacional de Identidad",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 2
}
```

---

### 2. Crear Tipo de Documento (Solo Admin)

**Endpoint:** `POST /api/document-types/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "name": "Carné de Extranjería",
  "description": "Carné de Extranjería"
}
```

**Response 201 (Success):**
```json
{
  "id": 3,
  "name": "Carné de Extranjería",
  "description": "Carné de Extranjería",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

## 🎯 Especialidades - Endpoints Adicionales

### 1. Listar Especialidades (Público)

**Endpoint:** `GET /api/specialties/`

**Query Parameters:**
- `include_inactive` (boolean, opcional, default: false): Incluir especialidades inactivas

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
[
  {
    "id": 1,
    "name": "Frontend Development",
    "description": "Desarrollo de interfaces de usuario",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### 2. Crear Especialidad (Solo Admin)

**Endpoint:** `POST /api/specialties/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "name": "Desarrollo Móvil",
  "description": "Especialidad en desarrollo móvil",
  "is_active": true
}
```

**Response 201 (Success):**
```json
{
  "id": 3,
  "name": "Desarrollo Móvil",
  "description": "Especialidad en desarrollo móvil",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

## 🌍 Datos Geográficos - Endpoints Completos

### 1. Listar Países (Público)

**Endpoint:** `GET /api/countries/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 184,
      "name": "Perú",
      "phone_code": "51",
      "iso2": "PE",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 252
}
```

---

### 2. Obtener Regiones de un País (Público)

**Endpoint:** `GET /api/countries/{country_id}/regions/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "country_id": 184,
  "results": [
    {
      "id": 15,
      "name": "Lima",
      "country_id": 184,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 25
}
```

---

### 3. Obtener Provincias de una Región (Público)

**Endpoint:** `GET /api/regions/{region_id}/provinces/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "region_id": 15,
  "results": [
    {
      "id": 150,
      "name": "Lima",
      "region_id": 15,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

---

### 4. Obtener Distritos de una Provincia (Público)

**Endpoint:** `GET /api/provinces/{province_id}/districts/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "province_id": 150,
  "results": [
    {
      "id": 150101,
      "name": "Lima",
      "province_id": 150,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 43
}
```

---

## 📋 Resumen COMPLETO de TODOS los Endpoints

### 🏥 Health Check (1 endpoint)
- ✅ `GET /api/health/`

### 🔐 Autenticación (9 endpoints)
- ✅ `POST /api/auth/register/` - Registro de postulante (público)
- ✅ `POST /api/auth/register-admin/` - Registro de administrador (público)
- ✅ `POST /api/auth/login/` - Login email/password
- ✅ `POST /api/auth/oauth/` - Login/Registro OAuth
- ✅ `POST /api/auth/refresh/` - Refresh token
- ✅ `POST /api/auth/logout/` - Logout
- ✅ `POST /api/auth/check-email/` - Verificar si email existe
- ✅ `POST /api/auth/password-reset-request/` - Solicitar reset de contraseña
- ✅ `POST /api/auth/password-reset-confirm/` - Confirmar reset de contraseña

### 👤 Usuarios (14 endpoints)
- ✅ `GET /api/users/` - Listar usuarios (Admin)
- ✅ `POST /api/users/` - Crear usuario (Admin)
- ✅ `GET /api/users/{user_id}/` - Obtener usuario por ID (Admin)
- ✅ `PUT /api/users/{user_id}/` - Actualizar usuario completo (Admin)
- ✅ `PATCH /api/users/{user_id}/` - Actualizar usuario parcial (Admin)
- ✅ `DELETE /api/users/{user_id}/` - Eliminar usuario (Admin)
- ✅ `GET /api/users/me/` - Obtener usuario actual
- ✅ `PATCH /api/users/me/password/` - Cambiar contraseña
- ✅ `POST /api/users/me/verify-email/` - Solicitar verificación de email
- ✅ `POST /api/users/me/verify-email/confirm/` - Confirmar verificación de email
- ✅ `PATCH /api/users/me/photo/` - Actualizar foto de perfil
- ✅ `GET /api/users/me/activity/` - Obtener actividad del usuario
- ✅ `GET /api/users/me/role/` - Obtener mi rol
- ✅ `POST /api/users/{user_id}/change-role/` - Cambiar rol de usuario (Admin)

### 🎭 Roles (4 endpoints)
- ✅ `GET /api/roles/` - Listar roles (Admin)
- ✅ `POST /api/roles/` - Crear rol (Admin)
- ✅ `GET /api/roles/{role_id}/` - Obtener rol por ID (Admin)
- ✅ `PATCH /api/roles/{role_id}/` - Actualizar rol (Admin)

### 📋 Postulantes (16 endpoints)
- ✅ `GET /api/postulants/` - Listar postulantes (Admin o propio)
- ✅ `POST /api/postulants/` - Crear postulante (Postularse a convocatoria)
- ✅ `GET /api/postulants/{postulant_id}/` - Obtener postulante por ID
- ✅ `PATCH /api/postulants/{postulant_id}/` - Actualizar postulante
- ✅ `DELETE /api/postulants/{postulant_id}/` - Eliminar postulante (Admin)
- ✅ `GET /api/postulants/me/personal-data/` - Obtener mis datos personales
- ✅ `POST /api/postulants/me/personal-data/` - Crear mis datos personales
- ✅ `PATCH /api/postulants/me/personal-data/` - Actualizar mis datos personales
- ✅ `GET /api/postulants/{postulant_id}/personal-data/` - Obtener datos personales (con ID)
- ✅ `POST /api/postulants/{postulant_id}/personal-data/` - Crear datos personales (con ID)
- ✅ `PATCH /api/postulants/{postulant_id}/personal-data/` - Actualizar datos personales (con ID)
- ✅ `GET /api/postulants/{postulant_id}/survey-responses/` - Listar respuestas de encuesta
- ✅ `GET /api/postulants/{postulant_id}/survey-responses/{tipo_encuesta}/` - Obtener respuesta específica
- ✅ `POST /api/postulants/{postulant_id}/survey-responses/` - Crear respuesta de encuesta
- ✅ `PATCH /api/postulants/{postulant_id}/survey-responses/{tipo_encuesta}/` - Actualizar respuesta de encuesta
- ✅ `POST /api/postulants/{postulant_id}/accept` - Aceptar postulante (Admin)
- ✅ `POST /api/postulants/{postulant_id}/reject` - Rechazar postulante (Admin)

### 🔄 Convocatorias (7 endpoints)
- ✅ `GET /api/convocatorias/` - Listar convocatorias (Público)
- ✅ `POST /api/convocatorias/` - Crear convocatoria (Admin)
- ✅ `GET /api/convocatorias/{convocatoria_id}/` - Obtener convocatoria por ID (Público)
- ✅ `PATCH /api/convocatorias/{convocatoria_id}/` - Actualizar convocatoria (Admin)
- ✅ `DELETE /api/convocatorias/{convocatoria_id}/` - Eliminar convocatoria (Admin)
- ✅ `POST /api/convocatorias/{convocatoria_id}/cerrar` - Cerrar convocatoria (Admin)
- ✅ `POST /api/convocatorias/{job_posting_id}/start-evaluation/` - Iniciar evaluación automática

### 🌍 Datos Geográficos (4 endpoints)
- ✅ `GET /api/countries/` - Listar países (Público)
- ✅ `GET /api/countries/{country_id}/regions/` - Obtener regiones de un país (Público)
- ✅ `GET /api/regions/{region_id}/provinces/` - Obtener provincias de una región (Público)
- ✅ `GET /api/provinces/{province_id}/districts/` - Obtener distritos de una provincia (Público)

### 📄 Tipos de Documento (6 endpoints)
- ✅ `GET /api/document-types/` - Listar tipos de documento (Público)
- ✅ `POST /api/document-types/` - Crear tipo de documento (Admin)
- ✅ `GET /api/document-types/{document_type_id}/` - Obtener tipo de documento por ID (Admin)
- ✅ `PUT /api/document-types/{document_type_id}/` - Actualizar tipo de documento completo (Admin)
- ✅ `PATCH /api/document-types/{document_type_id}/` - Actualizar tipo de documento parcial (Admin)
- ✅ `DELETE /api/document-types/{document_type_id}/` - Eliminar tipo de documento (Admin)

### 🎯 Especialidades (6 endpoints)
- ✅ `GET /api/specialties/` - Listar especialidades (Público)
- ✅ `POST /api/specialties/` - Crear especialidad (Admin)
- ✅ `GET /api/specialties/{specialty_id}/` - Obtener especialidad por ID (Público)
- ✅ `PUT /api/specialties/{specialty_id}/` - Actualizar especialidad completa (Admin)
- ✅ `PATCH /api/specialties/{specialty_id}/` - Actualizar especialidad parcial (Admin)
- ✅ `DELETE /api/specialties/{specialty_id}/` - Eliminar especialidad (Admin)

### 📝 Evaluaciones - CRUD (16 endpoints)
- ✅ `GET /api/evaluations/` - Listar evaluaciones (Admin)
- ✅ `POST /api/evaluations/` - Crear evaluación (Admin)
- ✅ `GET /api/evaluations/{evaluation_id}/` - Obtener evaluación por ID (Admin)
- ✅ `PUT /api/evaluations/{evaluation_id}/` - Actualizar evaluación completa (Admin)
- ✅ `PATCH /api/evaluations/{evaluation_id}/` - Actualizar evaluación parcial (Admin)
- ✅ `DELETE /api/evaluations/{evaluation_id}/` - Eliminar evaluación (Admin)
- ✅ `POST /api/evaluations/{evaluation_id}/questions/` - Crear pregunta (Admin)
- ✅ `GET /api/questions/{question_id}/` - Obtener pregunta por ID (Admin)
- ✅ `PUT /api/questions/{question_id}/` - Actualizar pregunta completa (Admin)
- ✅ `PATCH /api/questions/{question_id}/` - Actualizar pregunta parcial (Admin)
- ✅ `DELETE /api/questions/{question_id}/` - Eliminar pregunta (Admin)
- ✅ `POST /api/questions/{question_id}/options/` - Crear opción de respuesta (Admin)
- ✅ `GET /api/answer-options/{answer_option_id}/` - Obtener opción de respuesta por ID (Admin)
- ✅ `PUT /api/answer-options/{answer_option_id}/` - Actualizar opción completa (Admin)
- ✅ `PATCH /api/answer-options/{answer_option_id}/` - Actualizar opción parcial (Admin)
- ✅ `DELETE /api/answer-options/{answer_option_id}/` - Eliminar opción (Admin)

### 📝 Evaluaciones - Intentos (9 endpoints)
- ✅ `POST /api/evaluations/{evaluation_id}/start/` - Iniciar intento manual
- ✅ `POST /api/convocatorias/{job_posting_id}/start-evaluation/` - Iniciar evaluación automática
- ✅ `GET /api/evaluations/{evaluation_id}/view/` - Obtener evaluación para postulante (sin respuestas correctas)
- ✅ `GET /api/evaluations/{evaluation_id}/attempt/` - Obtener intento activo
- ✅ `GET /api/evaluation-attempts/me/` - Listar mis intentos
- ✅ `GET /api/evaluation-attempts/{attempt_id}/` - Obtener intento por ID
- ✅ `POST /api/evaluation-attempts/{attempt_id}/answers/` - Guardar respuesta individual
- ✅ `POST /api/evaluation-attempts/{attempt_id}/answers/batch/` - Guardar respuestas en lote
- ✅ `POST /api/evaluation-attempts/{attempt_id}/grade/` - Calificar intento

### 📊 Dashboard (7 endpoints)
- ✅ `GET /api/dashboard/stats/` - Estadísticas generales (Admin)
- ✅ `GET /api/dashboard/convocatorias/{convocatoria_id}/stats/` - Estadísticas de convocatoria (Admin)
- ✅ `GET /api/dashboard/users/activity/` - Actividad de usuarios (Admin)
- ✅ `GET /api/dashboard/postulants/my-progress/` - Mi progreso (Postulante)
- ✅ `GET /api/dashboard/postulants/{postulant_id}/progress/` - Progreso de postulante (Admin)
- ✅ `GET /api/dashboard/convocatorias/{convocatoria_id}/postulants-progress/` - Progreso por convocatoria (Admin)
- ✅ `GET /api/dashboard/postulants/average-progress/` - Progreso promedio (Admin)

### 📁 Archivos (4 endpoints)
- ✅ `POST /api/files/upload/` - Subir documento
- ✅ `GET /api/files/my-documents/` - Listar mis documentos
- ✅ `GET /api/files/{document_id}/download/` - Obtener URL de descarga
- ✅ `DELETE /api/files/{document_id}/` - Eliminar documento

---

## 📊 Estadísticas Totales

**Total de Endpoints Únicos: 102**

- Health Check: 1
- Autenticación: 9
- Usuarios: 14
- Roles: 4
- Postulantes: 16
- Convocatorias: 7
- Datos Geográficos: 4
- Tipos de Documento: 6
- Especialidades: 6
- Evaluaciones (CRUD): 16
- Evaluaciones (Intentos): 9
- Dashboard: 7
- Archivos: 4

**Total: 102 endpoints únicos documentados**

---

## 🔒 Permisos

- **Público**: No requiere autenticación
- **Autenticado**: Requiere `Authorization: Bearer <access_token>`
- **Solo Admin**: Requiere autenticación + rol de administrador (`role_id=2`)

---

## 📝 Notas Importantes

1. Todos los endpoints que modifican datos (POST, PUT, PATCH, DELETE) requieren autenticación
2. Los endpoints de administrador requieren `role_id=2`
3. Los endpoints de postulantes pueden ser accedidos por el mismo postulante o por un admin
4. Los IDs de evaluación, pregunta y opción de respuesta son UUIDs (strings)
5. Los IDs de usuario, postulante, convocatoria, etc. pueden ser enteros o UUIDs dependiendo del endpoint

---

**¡Documentación completa! 🎉**

