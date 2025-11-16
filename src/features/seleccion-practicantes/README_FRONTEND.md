# 📘 Documentación de API para Frontend - RPSoft Backend

## 🔧 Configuración Base

### Base URL
```
http://localhost:5173/api/
```

**⚠️ IMPORTANTE:** El frontend debe configurar un proxy o usar esta URL directamente. Asegúrate de que tu servidor backend esté corriendo en `http://localhost:8000`.

### Headers por Defecto
Todas las peticiones autenticadas deben incluir:
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

### Manejo de Tokens
- **Access Token**: Se usa en todas las peticiones autenticadas
- **Refresh Token**: Se usa para renovar el access token cuando expire
- **Almacenamiento**: Guarda ambos tokens en `localStorage` o `sessionStorage`
- **Renovación automática**: Implementa un interceptor que renueve el token automáticamente cuando expire

---

## 🔐 Autenticación

### 1. Registro de Postulante (Público)

**Endpoint:** `POST /api/auth/register/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "postulante@example.com",
  "password": "password123",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García"
}
```

**Campos:**
- `email` (string, requerido): Email del usuario
- `password` (string, requerido): Mínimo 8 caracteres
- `name` (string, requerido): Nombre del usuario
- `paternal_lastname` (string, requerido): Apellido paterno
- `maternal_lastname` (string, opcional): Apellido materno

**⚠️ NOTA:** El `username` se genera automáticamente desde el email. No es necesario enviarlo.

**Response 201 (Success):**
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
  },
  "info": "Ahora puedes postularte a convocatorias usando POST /api/postulants/"
}
```

**Response 400 (Error):**
```json
{
  "error": "El usuario con email postulante@example.com ya existe"
}
```

---

### 2. Registro de Administrador (Público)

**Endpoint:** `POST /api/auth/register-admin/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin",
  "paternal_lastname": "Sistema",
  "maternal_lastname": "Principal"
}
```

**Response 201 (Success):**
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

---

### 3. Login (Email/Password)

**Endpoint:** `POST /api/auth/login/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200 (Success):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "b889d574-0e72-5717-be54-295d54482be5",
    "email": "user@example.com",
    "username": "username",
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

**Response 401 (Error):**
```json
{
  "error": "Credenciales inválidas"
}
```

---

### 4. Login OAuth (Google/Microsoft)

**Endpoint:** `POST /api/auth/oauth/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body (Login - Usuario Existente):**
```json
{
  "provider": "google",
  "provider_id": "123456789"
}
```

**Request Body (Registro/Login - Usuario Nuevo):**
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

**Campos:**
- `provider` (string, requerido): `"google"` o `"microsoft"`
- `provider_id` (string, requerido): ID del usuario en el proveedor OAuth
- `email` (string, requerido solo para nuevos usuarios): Email del usuario
- `name` (string, opcional): Nombre del usuario (solo para nuevos usuarios)
- `paternal_lastname` (string, opcional): Apellido paterno (solo para nuevos usuarios)
- `maternal_lastname` (string, opcional): Apellido materno (solo para nuevos usuarios)
- `role_id` (int, opcional, default: 1): `1` para Postulante, `2` para Admin (solo para nuevos usuarios)

**⚠️ IMPORTANTE:**
- Si el usuario ya existe, se autentica y mantiene su `role_id` original
- Si el usuario no existe, se crea con el `role_id` proporcionado
- Si no se proporciona `email` y el usuario no existe, se retorna error 404

**Response 200 (Success):**
```json
{
  "message": "Autenticación google exitosa",
  "user": {
    "id": "ba2a3b27-0759-570e-8f5f-f3860bea008b",
    "email": "user@gmail.com",
    "username": "user",
    "name": "Juan",
    "paternal_lastname": "Pérez",
    "maternal_lastname": "García",
    "role_id": 1,
    "provider": "google"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response 404 (Usuario no encontrado):**
```json
{
  "error": "No se encontró una cuenta registrada. Por favor, regístrate primero."
}
```

---

### 5. Refresh Token

**Endpoint:** `POST /api/auth/refresh/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 (Success):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 6. Logout

**Endpoint:** `POST /api/auth/logout/`

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
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 (Success):**
```json
{
  "message": "Logout exitoso"
}
```

---

### 7. Verificar Email Existe

**Endpoint:** `POST /api/auth/check-email/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response 200 (Email existe):**
```json
{
  "exists": true,
  "message": "El email ya está registrado"
}
```

**Response 200 (Email no existe):**
```json
{
  "exists": false,
  "message": "El email no está registrado"
}
```

---

### 8. Solicitar Reset de Contraseña

**Endpoint:** `POST /api/auth/password-reset-request/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response 200 (Success):**
```json
{
  "message": "Código de recuperación enviado al email"
}
```

---

### 9. Confirmar Reset de Contraseña

**Endpoint:** `POST /api/auth/password-reset-confirm/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "newpassword123"
}
```

**Response 200 (Success):**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

---

## 👤 Usuarios

### 1. Obtener Usuario Actual

**Endpoint:** `GET /api/users/me/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "id": "b889d574-0e72-5717-be54-295d54482be5",
  "email": "user@example.com",
  "username": "username",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "role_id": 1,
  "provider": "email",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Listar Usuarios (Solo Admin)

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
      "id": "b889d574-0e72-5717-be54-295d54482be5",
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

---

### 3. Crear Usuario (Solo Admin)

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
  "id": "b889d574-0e72-5717-be54-295d54482be5",
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

### 4. Obtener Usuario por ID (Solo Admin)

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
  "id": "b889d574-0e72-5717-be54-295d54482be5",
  "email": "user@example.com",
  "username": "username",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "role_id": 1,
  "is_active": true
}
```

---

### 5. Actualizar Usuario (Solo Admin)

**Endpoint:** `PUT /api/users/{user_id}/` o `PATCH /api/users/{user_id}/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body (PUT - todos los campos):**
```json
{
  "email": "updated@example.com",
  "username": "updateduser",
  "name": "Actualizado",
  "paternal_lastname": "Usuario",
  "maternal_lastname": "Test",
  "role_id": 1,
  "is_active": true
}
```

**Request Body (PATCH - campos parciales):**
```json
{
  "name": "Nuevo Nombre",
  "is_active": false
}
```

---

### 6. Eliminar Usuario (Solo Admin)

**Endpoint:** `DELETE /api/users/{user_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

### 7. Cambiar Contraseña (Usuario Actual)

**Endpoint:** `POST /api/users/me/password/`

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
  "old_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

**Response 200 (Success):**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

---

### 8. Obtener Mi Rol

**Endpoint:** `GET /api/users/me/role/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "role_id": 1,
  "role_name": "Postulante"
}
```

---

## 📋 Convocatorias

### 1. Listar Convocatorias (Público)

**Endpoint:** `GET /api/convocatorias/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `estado` o `status` (string, opcional): `"abierta"`, `"cerrada"`, `"finalizada"`

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
  "total": 10,
  "page": 1,
  "page_size": 20
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

### 4. Actualizar Convocatoria (Solo Admin)

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
  "status": "cerrada"
}
```

---

### 5. Cerrar Convocatoria (Solo Admin)

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
  "message": "Convocatoria cerrada exitosamente",
  "convocatoria": {
    "id": 1,
    "status": "cerrada"
  }
}
```

---

## 👥 Postulantes

### 1. Listar Postulantes (Solo Admin)

**Endpoint:** `GET /api/postulants/`

**Query Parameters:**
- `page` (int, opcional, default: 1): Número de página
- `page_size` (int, opcional, default: 20): Tamaño de página
- `job_posting_id` (int, opcional): Filtrar por convocatoria
- `state` (string, opcional): `"pendiente"`, `"aceptado"`, `"rechazado"`

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
      "job_posting_id": 1,
      "state": "pendiente",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20
}
```

---

### 2. Postularse a una Convocatoria (Postulante)

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

**⚠️ NOTA:** También acepta `convocatoria_id` para compatibilidad.

**Response 201 (Success):**
```json
{
  "id": 1,
  "user_id": 1,
  "job_posting_id": 1,
  "state": "pendiente",
  "created_at": "2025-01-01T00:00:00Z"
}
```

**Response 400 (Error - Ya postulado):**
```json
{
  "error": "Ya estás postulado a esta convocatoria"
}
```

---

### 3. Obtener Postulante por ID (Solo Admin)

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
  "state": "pendiente",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 4. Guardar/Actualizar Datos Personales (Postulante)

**Endpoint:** `POST /api/postulants/me/personal-data/`

**⚠️ IMPORTANTE:** Este endpoint usa el usuario autenticado automáticamente. No necesitas pasar el `postulant_id`.

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
- `country_id` (int, requerido): ID del país (184 para Perú)
- `region_id` (int, requerido): ID de la región
- `province_id` (int, requerido): ID de la provincia
- `district_id` (int, requerido): ID del distrito
- `address` (string, requerido): Dirección
- `specialty_id` (int, requerido): ID de la especialidad
- `career` (string, requerido): Carrera
- `semester` (string, requerido): Semestre
- `experience_level` (string, requerido): `"principiante"`, `"intermedio"`, `"avanzado"`

**Response 200 (Success):**
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

---

### 5. Obtener Datos Personales (Postulante)

**Endpoint:** `GET /api/postulants/me/personal-data/`

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

---

### 6. Aceptar Postulante (Solo Admin)

**Endpoint:** `POST /api/postulants/{postulant_id}/accept`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "message": "Postulante aceptado exitosamente",
  "postulant": {
    "id": 1,
    "state": "aceptado"
  }
}
```

---

### 7. Rechazar Postulante (Solo Admin)

**Endpoint:** `POST /api/postulants/{postulant_id}/reject`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "message": "Postulante rechazado exitosamente",
  "postulant": {
    "id": 1,
    "state": "rechazado"
  }
}
```

---

## 🌍 Datos Geográficos (Select en Cascada)

### ⚠️ IMPORTANTE: País Fijo
El frontend siempre trabajará con **Perú** (country_id = 184). Puedes hardcodear este valor o buscarlo una vez al inicio.

---

### 1. Obtener Todos los Países

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

**Flujo en Frontend:**
```javascript
// 1. Al cargar el componente, buscar Perú
const response = await fetch('/api/countries/');
const data = await response.json();
const peru = data.results.find(country => country.name === 'Perú');
const countryId = peru.id; // 184

// O simplemente hardcodear:
const countryId = 184;
```

---

### 2. Obtener Regiones de un País

**Endpoint:** `GET /api/countries/{country_id}/regions/`

**Ejemplo:** `GET /api/countries/184/regions/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "country_id": 184,
  "results": [
    {
      "id": 1,
      "name": "Amazonas",
      "country_id": 184,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    },
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

**Flujo en Frontend:**
```javascript
// Al cargar el componente o cuando se selecciona el país
async function loadRegions(countryId) {
  const response = await fetch(`/api/countries/${countryId}/regions/`);
  const data = await response.json();
  setRegions(data.results);
  // Limpiar provincias y distritos
  setProvinces([]);
  setDistricts([]);
}

// Llamar al cargar:
loadRegions(184); // Perú
```

---

### 3. Obtener Provincias de una Región

**Endpoint:** `GET /api/regions/{region_id}/provinces/`

**Ejemplo:** `GET /api/regions/15/provinces/` (Lima)

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
    },
    {
      "id": 151,
      "name": "Barranca",
      "region_id": 15,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

**Flujo en Frontend:**
```javascript
// Cuando el usuario selecciona una región
async function onRegionChange(regionId) {
  const response = await fetch(`/api/regions/${regionId}/provinces/`);
  const data = await response.json();
  setProvinces(data.results);
  // Limpiar distritos
  setDistricts([]);
}
```

---

### 4. Obtener Distritos de una Provincia

**Endpoint:** `GET /api/provinces/{province_id}/districts/`

**Ejemplo:** `GET /api/provinces/150/districts/` (Lima)

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
    },
    {
      "id": 150102,
      "name": "Ancón",
      "province_id": 150,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 43
}
```

**Flujo en Frontend:**
```javascript
// Cuando el usuario selecciona una provincia
async function onProvinceChange(provinceId) {
  const response = await fetch(`/api/provinces/${provinceId}/districts/`);
  const data = await response.json();
  setDistricts(data.results);
}
```

---

### 📝 Ejemplo Completo de Select en Cascada

```javascript
// Componente React/Vue ejemplo
const [regions, setRegions] = useState([]);
const [provinces, setProvinces] = useState([]);
const [districts, setDistricts] = useState([]);
const [selectedRegion, setSelectedRegion] = useState(null);
const [selectedProvince, setSelectedProvince] = useState(null);
const [selectedDistrict, setSelectedDistrict] = useState(null);

const COUNTRY_ID = 184; // Perú

// 1. Cargar regiones al montar el componente
useEffect(() => {
  loadRegions();
}, []);

async function loadRegions() {
  const response = await fetch(`/api/countries/${COUNTRY_ID}/regions/`);
  const data = await response.json();
  setRegions(data.results);
}

// 2. Cuando se selecciona una región
async function handleRegionChange(regionId) {
  setSelectedRegion(regionId);
  setSelectedProvince(null);
  setSelectedDistrict(null);
  setProvinces([]);
  setDistricts([]);
  
  const response = await fetch(`/api/regions/${regionId}/provinces/`);
  const data = await response.json();
  setProvinces(data.results);
}

// 3. Cuando se selecciona una provincia
async function handleProvinceChange(provinceId) {
  setSelectedProvince(provinceId);
  setSelectedDistrict(null);
  setDistricts([]);
  
  const response = await fetch(`/api/provinces/${provinceId}/districts/`);
  const data = await response.json();
  setDistricts(data.results);
}

// 4. Cuando se selecciona un distrito
function handleDistrictChange(districtId) {
  setSelectedDistrict(districtId);
}

// Al enviar el formulario:
const formData = {
  country_id: COUNTRY_ID,
  region_id: selectedRegion,
  province_id: selectedProvince,
  district_id: selectedDistrict
};
```

---

## 📄 Tipos de Documento

### 1. Listar Tipos de Documento

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
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Pasaporte",
      "description": "Pasaporte",
      "is_active": true,
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

---

## 🎯 Especialidades

### 1. Listar Especialidades

**Endpoint:** `GET /api/specialties/`

**Headers:** No requiere autenticación

**Response 200 (Success):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Desarrollo Web",
      "description": "Especialidad en desarrollo web",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
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
  "description": "Especialidad en desarrollo móvil"
}
```

---

## 📊 Dashboard

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

---

## 📁 Archivos

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
formData.append('document_type', 'CV'); // Opcional
```

**Response 200 (Success):**
```json
{
  "id": 1,
  "filename": "documento.pdf",
  "file_url": "http://localhost:9000/documents/2025/11/documento.pdf",
  "document_type": "CV",
  "uploaded_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Listar Mis Documentos

**Endpoint:** `GET /api/files/my-documents/`

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
      "filename": "documento.pdf",
      "file_url": "http://localhost:9000/documents/2025/11/documento.pdf",
      "document_type": "CV",
      "uploaded_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

---

### 3. Obtener URL de Descarga

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

### 4. Eliminar Documento

**Endpoint:** `DELETE /api/files/{document_id}/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 204 (Success):** Sin contenido

---

## 📝 Evaluaciones

### 1. Listar Evaluaciones (Solo Admin)

**Endpoint:** `GET /api/evaluations/`

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
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
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
  "job_posting_id": 1,
  "title": "Evaluación de Desarrollo Web",
  "description": "Evaluación técnica",
  "specialty_id": 1,
  "experience_level": "intermedio"
}
```

---

### 3. Iniciar Evaluación Automática (Postulante)

**Endpoint:** `POST /api/convocatorias/{job_posting_id}/start-evaluation/`

**⚠️ IMPORTANTE:** Este endpoint asigna automáticamente una evaluación basada en la especialidad y nivel de experiencia del postulante.

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
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

---

### 4. Iniciar Intento de Evaluación (Postulante)

**Endpoint:** `POST /api/evaluations/{evaluation_id}/start/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response 200 (Success):**
```json
{
  "attempt_id": "uuid-attempt-id",
  "evaluation_id": "uuid-evaluation-id",
  "status": "in_progress",
  "started_at": "2025-01-01T00:00:00Z"
}
```

---

### 5. Obtener Evaluación (Postulante)

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
      "type": "multiple_choice",
      "options": [
        {
          "id": "uuid-option-id",
          "text": "Una librería de JavaScript",
          "is_correct": true
        }
      ]
    }
  ]
}
```

---

### 6. Obtener Intento Activo (Postulante)

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
  "id": "uuid-attempt-id",
  "evaluation_id": "uuid-evaluation-id",
  "status": "in_progress",
  "started_at": "2025-01-01T00:00:00Z",
  "completed_at": null,
  "score": null
}
```

---

### 7. Listar Mis Intentos (Postulante)

**Endpoint:** `GET /api/evaluation-attempts/me/`

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
      "status": "completed",
      "score": 85.5,
      "started_at": "2025-01-01T00:00:00Z",
      "completed_at": "2025-01-01T01:00:00Z"
    }
  ],
  "total": 5
}
```

---

### 8. Guardar Respuesta (Postulante)

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
  "answer_option_id": "uuid-option-id"
}
```

**Response 200 (Success):**
```json
{
  "message": "Respuesta guardada exitosamente"
}
```

---

### 9. Guardar Respuestas en Lote (Postulante)

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
      "answer_option_id": "uuid-option-id-1"
    },
    {
      "question_id": "uuid-question-id-2",
      "answer_option_id": "uuid-option-id-2"
    }
  ]
}
```

---

### 10. Calificar Intento (Postulante)

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
  "attempt_id": "uuid-attempt-id",
  "score": 85.5,
  "total_questions": 10,
  "correct_answers": 8,
  "status": "completed"
}
```

---

## 🔄 Flujos Completos

### 📋 Flujo Completo: Postulante

#### 1. Registro y Autenticación
```javascript
// 1.1. Registro
const registerResponse = await fetch('/api/auth/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'postulante@example.com',
    password: 'password123',
    name: 'Juan',
    paternal_lastname: 'Pérez',
    maternal_lastname: 'García'
  })
});
const registerData = await registerResponse.json();

// Guardar tokens
localStorage.setItem('access_token', registerData.tokens.access);
localStorage.setItem('refresh_token', registerData.tokens.refresh);
localStorage.setItem('user', JSON.stringify(registerData.user));
```

#### 2. Ver Convocatorias Disponibles
```javascript
// 2.1. Listar convocatorias abiertas
const convocatoriasResponse = await fetch('/api/convocatorias/?estado=abierta');
const convocatoriasData = await convocatoriasResponse.json();
// Mostrar convocatorias en la vista
```

#### 3. Postularse a una Convocatoria
```javascript
// 3.1. Postularse
const postularResponse = await fetch('/api/postulants/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    job_posting_id: 1
  })
});
const postularData = await postularResponse.json();
```

#### 4. Completar Datos Personales
```javascript
// 4.1. Cargar datos geográficos (select en cascada)
// Ver sección de Datos Geográficos

// 4.2. Cargar tipos de documento
const docTypesResponse = await fetch('/api/document-types/');
const docTypesData = await docTypesResponse.json();

// 4.3. Cargar especialidades
const specialtiesResponse = await fetch('/api/specialties/');
const specialtiesData = await specialtiesResponse.json();

// 4.4. Guardar datos personales
const personalDataResponse = await fetch('/api/postulants/me/personal-data/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    document_type_id: 1,
    document_number: '12345678',
    birth_date: '1990-01-01',
    sex: 'M',
    phone: '+51987654321',
    country_id: 184,
    region_id: 15,
    province_id: 150,
    district_id: 150101,
    address: 'Av. Principal 123',
    specialty_id: 1,
    career: 'Ingeniería de Sistemas',
    semester: '10',
    experience_level: 'intermedio'
  })
});
```

#### 5. Iniciar Evaluación
```javascript
// 5.1. Iniciar evaluación automática (recomendado)
const evaluationResponse = await fetch('/api/convocatorias/1/start-evaluation/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
const evaluationData = await evaluationResponse.json();
const attemptId = evaluationData.evaluation_attempt.id;
const evaluationId = evaluationData.evaluation_attempt.evaluation_id;

// 5.2. Obtener preguntas de la evaluación
const questionsResponse = await fetch(`/api/evaluations/${evaluationId}/view/`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
const questionsData = await questionsResponse.json();

// 5.3. Mostrar preguntas al usuario
// Renderizar formulario con preguntas
```

#### 6. Responder Evaluación
```javascript
// 6.1. Guardar respuestas (una por una o en lote)
const saveAnswerResponse = await fetch(`/api/evaluation-attempts/${attemptId}/answers/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    question_id: 'uuid-question-id',
    answer_option_id: 'uuid-option-id'
  })
});

// O guardar todas las respuestas de una vez:
const saveAnswersResponse = await fetch(`/api/evaluation-attempts/${attemptId}/answers/batch/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    answers: [
      { question_id: 'uuid-1', answer_option_id: 'uuid-option-1' },
      { question_id: 'uuid-2', answer_option_id: 'uuid-option-2' }
    ]
  })
});
```

#### 7. Finalizar y Calificar Evaluación
```javascript
// 7.1. Calificar intento
const gradeResponse = await fetch(`/api/evaluation-attempts/${attemptId}/grade/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
const gradeData = await gradeResponse.json();
// Mostrar resultado: gradeData.score
```

#### 8. Ver Progreso
```javascript
// 8.1. Ver mi progreso
const progressResponse = await fetch('/api/dashboard/postulants/my-progress/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
const progressData = await progressResponse.json();
// Mostrar progreso en dashboard
```

---

### 👨‍💼 Flujo Completo: Administrador

#### 1. Registro y Autenticación
```javascript
// 1.1. Registro de administrador
const registerResponse = await fetch('/api/auth/register-admin/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin',
    paternal_lastname: 'Sistema',
    maternal_lastname: 'Principal'
  })
});
const registerData = await registerResponse.json();

// Guardar tokens
localStorage.setItem('access_token', registerData.tokens.access);
localStorage.setItem('refresh_token', registerData.tokens.refresh);
localStorage.setItem('user', JSON.stringify(registerData.user));
```

#### 2. Dashboard Principal
```javascript
// 2.1. Obtener estadísticas generales
const statsResponse = await fetch('/api/dashboard/stats/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
const statsData = await statsResponse.json();
// Mostrar estadísticas en dashboard
```

#### 3. Gestionar Convocatorias
```javascript
// 3.1. Crear convocatoria
const createConvocatoriaResponse = await fetch('/api/convocatorias/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    title: 'Convocatoria de Desarrollo',
    description: 'Buscamos desarrolladores',
    start_date: '2025-01-01T00:00:00Z',
    end_date: '2025-12-31T23:59:59Z',
    status: 'abierta'
  })
});

// 3.2. Listar todas las convocatorias
const convocatoriasResponse = await fetch('/api/convocatorias/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

// 3.3. Cerrar convocatoria
const closeResponse = await fetch('/api/convocatorias/1/cerrar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

#### 4. Gestionar Postulantes
```javascript
// 4.1. Listar postulantes
const postulantsResponse = await fetch('/api/postulants/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

// 4.2. Ver detalles de un postulante
const postulantDetailResponse = await fetch('/api/postulants/1/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

// 4.3. Aceptar postulante
const acceptResponse = await fetch('/api/postulants/1/accept', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

// 4.4. Rechazar postulante
const rejectResponse = await fetch('/api/postulants/1/reject', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

#### 5. Gestionar Evaluaciones
```javascript
// 5.1. Crear evaluación
const createEvaluationResponse = await fetch('/api/evaluations/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    job_posting_id: 1,
    title: 'Evaluación de Desarrollo Web',
    description: 'Evaluación técnica',
    specialty_id: 1,
    experience_level: 'intermedio'
  })
});
const evaluationData = await createEvaluationResponse.json();
const evaluationId = evaluationData.id;

// 5.2. Crear pregunta
const createQuestionResponse = await fetch(`/api/evaluations/${evaluationId}/questions/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    text: '¿Qué es React?',
    type: 'multiple_choice',
    order: 1
  })
});
const questionData = await createQuestionResponse.json();
const questionId = questionData.id;

// 5.3. Crear opciones de respuesta
const createOptionResponse = await fetch(`/api/questions/${questionId}/options/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    text: 'Una librería de JavaScript',
    is_correct: true,
    order: 1
  })
});
```

#### 6. Gestionar Usuarios
```javascript
// 6.1. Listar usuarios
const usersResponse = await fetch('/api/users/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

// 6.2. Crear usuario
const createUserResponse = await fetch('/api/users/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    username: 'newuser',
    password: 'password123',
    name: 'Nuevo',
    paternal_lastname: 'Usuario',
    role_id: 1
  })
});
```

#### 7. Gestionar Especialidades y Tipos de Documento
```javascript
// 7.1. Crear especialidad
const createSpecialtyResponse = await fetch('/api/specialties/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    name: 'Desarrollo Móvil',
    description: 'Especialidad en desarrollo móvil'
  })
});

// 7.2. Crear tipo de documento
const createDocTypeResponse = await fetch('/api/document-types/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({
    name: 'Carné de Extranjería',
    description: 'Carné de Extranjería'
  })
});
```

---

## 🔒 Manejo de Errores

### Códigos de Estado HTTP

- **200 OK**: Petición exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Operación exitosa sin contenido
- **400 Bad Request**: Error en los datos enviados
- **401 Unauthorized**: No autenticado o token inválido
- **403 Forbidden**: No tienes permisos para esta acción
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

### Estructura de Error

```json
{
  "error": "Mensaje de error descriptivo"
}
```

### Manejo de Token Expirado

```javascript
// Interceptor para renovar token automáticamente
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Si el token expiró, intentar renovarlo
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    const refreshResponse = await fetch('/api/auth/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });
    
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem('access_token', refreshData.access);
      
      // Reintentar la petición original
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${refreshData.access}`
        }
      });
    } else {
      // Redirigir al login
      localStorage.clear();
      window.location.href = '/login';
    }
  }
  
  return response;
}
```

---

## 📝 Notas Importantes

1. **Base URL**: Asegúrate de configurar correctamente la base URL en tu aplicación frontend
2. **Tokens**: Guarda los tokens de forma segura y renueva automáticamente cuando expiren
3. **Permisos**: Verifica el `role_id` del usuario para mostrar/ocultar funcionalidades
4. **Select en Cascada**: Siempre usa `country_id = 184` para Perú
5. **Datos Personales**: El endpoint `/api/postulants/me/personal-data/` usa automáticamente el usuario autenticado
6. **Evaluaciones**: Usa `/api/convocatorias/{job_posting_id}/start-evaluation/` para asignación automática
7. **Paginación**: Todos los endpoints de listado soportan `page` y `page_size`
8. **Fechas**: Usa formato ISO 8601: `"2025-01-01T00:00:00Z"`

---

## 🚀 Ejemplo de Configuración de Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5173/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores y renovar token
api.interceptors.response.use(
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

export default api;
```

---

## ✅ Checklist de Implementación

### Autenticación
- [ ] Registro de postulante
- [ ] Registro de administrador
- [ ] Login email/password
- [ ] Login OAuth
- [ ] Refresh token
- [ ] Logout
- [ ] Recuperación de contraseña

### Postulante
- [ ] Ver convocatorias
- [ ] Postularse a convocatoria
- [ ] Completar datos personales
- [ ] Select en cascada (región/provincia/distrito)
- [ ] Iniciar evaluación
- [ ] Responder evaluación
- [ ] Ver progreso

### Administrador
- [ ] Dashboard con estadísticas
- [ ] Gestionar convocatorias
- [ ] Gestionar postulantes
- [ ] Aceptar/rechazar postulantes
- [ ] Gestionar evaluaciones
- [ ] Crear preguntas y opciones
- [ ] Gestionar usuarios
- [ ] Gestionar especialidades
- [ ] Gestionar tipos de documento

### Archivos
- [ ] Subir documentos
- [ ] Listar mis documentos
- [ ] Descargar documentos
- [ ] Eliminar documentos

---

**¡Éxito con la implementación! 🎉**

