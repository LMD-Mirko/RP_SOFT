# Documentación de Perfil de Usuario - Frontend

Esta documentación describe cómo funciona la gestión del perfil de usuario, incluyendo cambio de contraseña, actualización de perfil y cambio de email.

## Tabla de Contenidos

1. [Obtener Perfil del Usuario](#obtener-perfil-del-usuario)
2. [Actualizar Perfil](#actualizar-perfil)
3. [Cambio de Contraseña](#cambio-de-contraseña)
4. [Cambio de Email](#cambio-de-email)
5. [Validación de Usuarios OAuth](#validación-de-usuarios-oauth)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Obtener Perfil del Usuario

### Endpoint
```
GET /api/users/me/
```

### Headers
```
Authorization: Bearer <access_token>
```

### Respuesta Exitosa (200)
```json
{
  "id": "ba2a3b27-0759-570e-8f5f-f3860bea008b",
  "email": "usuario@example.com",
  "username": "usuario123",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "document_type_id": 1,
  "document_type_name": "DNI",
  "document_number": "12345678",
  "sex": "M",
  "photo_url": "/api/users/me/photo/view/",
  "phone": "+51987654321",
  "country_id": 173,
  "country_name": "Perú",
  "region_id": 15,
  "region_name": "Lima",
  "province_id": 1501,
  "province_name": "Lima",
  "district_id": 150101,
  "district_name": "Lima",
  "is_active": true,
  "role_id": 1,
  "account_status": "active",
  "is_email_verified": true,
  "created_at": "2025-01-10T10:00:00Z",
  "date_joined": "2025-01-10T10:00:00Z",
  "updated_at": "2025-01-10T11:00:00Z",
  "provider": "email",
  "can_change_email": true,
  "can_change_password": true
}
```

### Campos Importantes

- **`provider`**: Indica el proveedor de autenticación. Puede ser:
  - `"email"`: Usuario registrado con email/contraseña
  - `"google"`: Usuario autenticado con Google
  - `"microsoft"`: Usuario autenticado con Microsoft

- **`can_change_email`**: `true` si el usuario puede cambiar su email, `false` si es usuario OAuth
- **`can_change_password`**: `true` si el usuario puede cambiar su contraseña, `false` si es usuario OAuth

**⚠️ IMPORTANTE**: Usuarios con `provider` igual a `"google"` o `"microsoft"` NO pueden cambiar su email ni contraseña. El frontend debe ocultar o deshabilitar estas opciones cuando `can_change_email` o `can_change_password` sean `false`.

---

## Actualizar Perfil

### Endpoint
```
PATCH /api/users/me/
```

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Campos Actualizables

Puedes actualizar los siguientes campos del perfil:

- `name` (string): Nombre del usuario
- `paternal_lastname` (string): Apellido paterno
- `maternal_lastname` (string): Apellido materno
- `document_type_id` (integer): ID del tipo de documento
- `document_number` (string): Número de documento
- `sex` (string): Sexo - 'M' (Masculino), 'F' (Femenino), 'O' (Otro)
- `phone` (string): Teléfono del usuario
- `country_id` (integer): ID del país
- `region_id` (integer): ID de la región
- `province_id` (integer): ID de la provincia
- `district_id` (integer): ID del distrito

### Campos NO Actualizables

Los siguientes campos **NO** se pueden actualizar mediante este endpoint:
- `email` - Usa el endpoint de cambio de email
- `username` - No se puede cambiar
- `password` - Usa el endpoint de cambio de contraseña
- `role_id` - Solo administradores pueden cambiar roles
- `is_active` - Solo administradores pueden cambiar esto
- `account_status` - Solo administradores pueden cambiar esto
- `is_email_verified` - Se actualiza automáticamente

### Request Body
```json
{
  "name": "Juan Carlos",
  "paternal_lastname": "Pérez",
  "maternal_lastname": "García",
  "document_type_id": 1,
  "document_number": "12345678",
  "sex": "M",
  "phone": "+51987654321",
  "country_id": 173,
  "region_id": 15,
  "province_id": 1501,
  "district_id": 150101
}
```

### Respuesta Exitosa (200)
```json
{
  "message": "Perfil actualizado exitosamente",
  "user": {
    "id": "ba2a3b27-0759-570e-8f5f-f3860bea008b",
    "email": "usuario@example.com",
    "username": "usuario123",
    "name": "Juan Carlos",
    "paternal_lastname": "Pérez",
    "maternal_lastname": "García",
    ...
  }
}
```

### Errores Posibles

- **400 Bad Request**: Si intentas actualizar un campo restringido
- **401 Unauthorized**: Si no estás autenticado
- **404 Not Found**: Si el usuario no existe

---

## Cambio de Contraseña

### Endpoint
```
PATCH /api/users/me/password/
```

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body
```json
{
  "current_password": "contraseña_actual",
  "new_password": "nueva_contraseña"
}
```

### Validaciones

- La contraseña actual debe ser correcta
- La nueva contraseña debe tener al menos 8 caracteres
- **No disponible para usuarios OAuth** (Google/Microsoft)

### Respuesta Exitosa (200)
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

### Errores Posibles

- **400 Bad Request**: 
  - `"La contraseña actual es incorrecta"`
  - `"La nueva contraseña debe tener al menos 8 caracteres"`
  - `"No puedes cambiar la contraseña de una cuenta vinculada con Google o Microsoft"`
- **401 Unauthorized**: Si no estás autenticado
- **404 Not Found**: Si el usuario no existe

### Flujo Recomendado en Frontend

1. Verificar que `can_change_password` sea `true` antes de mostrar el formulario
2. Solicitar contraseña actual y nueva contraseña
3. Validar que la nueva contraseña tenga al menos 8 caracteres
4. Enviar la petición
5. Mostrar mensaje de éxito o error según corresponda

---

## Cambio de Email

El cambio de email requiere un proceso de verificación en dos pasos:

1. **Solicitar cambio de email** - Se envía un código al email actual
2. **Confirmar cambio de email** - Se valida el código y se actualiza el email

### Paso 1: Solicitar Cambio de Email

#### Endpoint
```
POST /api/users/me/change-email/request/
```

#### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "new_email": "nuevo@example.com"
}
```

#### Respuesta Exitosa (200)
```json
{
  "message": "Código de verificación enviado a tu email actual. Revisa tu bandeja de entrada para confirmar el cambio a nuevo@example.com"
}
```

#### Errores Posibles

- **400 Bad Request**:
  - `"new_email es requerido"`
  - `"El nuevo email debe ser diferente al actual"`
  - `"El formato del email no es válido"`
  - `"El email nuevo@example.com ya está en uso"`
  - `"No puedes cambiar el email de una cuenta vinculada con Google o Microsoft"`
- **401 Unauthorized**: Si no estás autenticado
- **404 Not Found**: Si el usuario no existe

### Paso 2: Confirmar Cambio de Email

#### Endpoint
```
POST /api/users/me/change-email/confirm/
```

#### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "code": "123456"
}
```

#### Respuesta Exitosa (200)
```json
{
  "message": "Email actualizado exitosamente. Por favor, verifica tu nuevo email.",
  "new_email": "nuevo@example.com",
  "is_email_verified": false
}
```

**Nota**: Después de cambiar el email, `is_email_verified` se establece en `false`. El usuario debe verificar el nuevo email.

#### Errores Posibles

- **400 Bad Request**:
  - `"Código de verificación es requerido"`
  - `"Código de verificación inválido"`
  - `"Código de verificación incorrecto"`
  - `"El código de verificación ha expirado"`
  - `"El email nuevo@example.com ya está en uso"`
  - `"No puedes cambiar el email de una cuenta vinculada con Google o Microsoft"`
- **401 Unauthorized**: Si no estás autenticado
- **404 Not Found**: Si el usuario no existe

### Flujo Recomendado en Frontend

1. **Verificar permisos**: Verificar que `can_change_email` sea `true` antes de mostrar el formulario
2. **Solicitar cambio**:
   - Mostrar formulario para ingresar nuevo email
   - Validar formato de email
   - Enviar petición a `/api/users/me/change-email/request/`
   - Mostrar mensaje de éxito indicando que se envió el código
3. **Confirmar cambio**:
   - Mostrar formulario para ingresar código de 6 dígitos
   - Opcional: Agregar contador de tiempo (el código expira en 15 minutos)
   - Enviar petición a `/api/users/me/change-email/confirm/`
   - Mostrar mensaje de éxito
   - Opcional: Redirigir a verificación de email si `is_email_verified` es `false`

---

## Validación de Usuarios OAuth

### Identificación de Usuarios OAuth

Los usuarios autenticados con Google o Microsoft tienen las siguientes características:

- `provider`: `"google"` o `"microsoft"`
- `can_change_email`: `false`
- `can_change_password`: `false`

### Comportamiento en Frontend

**Recomendaciones**:

1. **Ocultar opciones**: No mostrar los formularios de cambio de email/contraseña si `can_change_email` o `can_change_password` son `false`

2. **Mostrar mensaje informativo**: Si el usuario intenta acceder a estas opciones, mostrar un mensaje como:
   ```
   "No puedes cambiar tu email/contraseña porque tu cuenta está vinculada con Google/Microsoft. 
   Para cambiar estos datos, debes hacerlo desde tu cuenta de Google/Microsoft."
   ```

3. **Deshabilitar campos**: Si decides mostrar los campos, deshabilitarlos cuando `can_change_email` o `can_change_password` sean `false`

### Ejemplo de Validación en Frontend

```javascript
// Ejemplo en React/Vue/Angular
const user = await fetchUserProfile();

if (!user.can_change_email) {
  // Ocultar o deshabilitar formulario de cambio de email
  showMessage("No puedes cambiar tu email porque tu cuenta está vinculada con " + 
              (user.provider === 'google' ? 'Google' : 'Microsoft'));
}

if (!user.can_change_password) {
  // Ocultar o deshabilitar formulario de cambio de contraseña
  showMessage("No puedes cambiar tu contraseña porque tu cuenta está vinculada con " + 
              (user.provider === 'google' ? 'Google' : 'Microsoft'));
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Obtener y Mostrar Perfil

```javascript
// Obtener perfil
const response = await fetch('/api/users/me/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const user = await response.json();

// Mostrar información
console.log(`Nombre: ${user.name} ${user.paternal_lastname}`);
console.log(`Email: ${user.email}`);
console.log(`Puede cambiar email: ${user.can_change_email}`);
console.log(`Puede cambiar contraseña: ${user.can_change_password}`);
```

### Ejemplo 2: Actualizar Perfil

```javascript
// Actualizar perfil
const response = await fetch('/api/users/me/', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Juan Carlos',
    phone: '+51987654321',
    country_id: 173,
    region_id: 15
  })
});

const result = await response.json();
console.log(result.message); // "Perfil actualizado exitosamente"
```

### Ejemplo 3: Cambiar Contraseña

```javascript
// Verificar que puede cambiar contraseña
const user = await fetchUserProfile();
if (!user.can_change_password) {
  alert('No puedes cambiar tu contraseña porque tu cuenta está vinculada con ' + 
        (user.provider === 'google' ? 'Google' : 'Microsoft'));
  return;
}

// Cambiar contraseña
const response = await fetch('/api/users/me/password/', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    current_password: 'contraseña_actual',
    new_password: 'nueva_contraseña_123'
  })
});

const result = await response.json();
if (response.ok) {
  console.log(result.message); // "Contraseña actualizada exitosamente"
} else {
  console.error(result.error);
}
```

### Ejemplo 4: Cambiar Email (Flujo Completo)

```javascript
// Paso 1: Verificar permisos
const user = await fetchUserProfile();
if (!user.can_change_email) {
  alert('No puedes cambiar tu email porque tu cuenta está vinculada con ' + 
        (user.provider === 'google' ? 'Google' : 'Microsoft'));
  return;
}

// Paso 2: Solicitar cambio de email
const requestResponse = await fetch('/api/users/me/change-email/request/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    new_email: 'nuevo@example.com'
  })
});

const requestResult = await requestResponse.json();
if (!requestResponse.ok) {
  console.error(requestResult.error);
  return;
}

console.log(requestResult.message);
// "Código de verificación enviado a tu email actual..."

// Paso 3: Confirmar cambio de email (después de que el usuario ingrese el código)
const confirmResponse = await fetch('/api/users/me/change-email/confirm/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: '123456' // Código ingresado por el usuario
  })
});

const confirmResult = await confirmResponse.json();
if (confirmResponse.ok) {
  console.log(confirmResult.message);
  console.log(`Nuevo email: ${confirmResult.new_email}`);
  if (!confirmResult.is_email_verified) {
    alert('Email actualizado. Por favor, verifica tu nuevo email.');
  }
} else {
  console.error(confirmResult.error);
}
```

---

## Resumen de Endpoints

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/api/users/me/` | Obtener perfil del usuario | Sí |
| PATCH | `/api/users/me/` | Actualizar perfil | Sí |
| PATCH | `/api/users/me/password/` | Cambiar contraseña | Sí |
| POST | `/api/users/me/change-email/request/` | Solicitar cambio de email | Sí |
| POST | `/api/users/me/change-email/confirm/` | Confirmar cambio de email | Sí |

---

## Notas Importantes

1. **Todos los endpoints requieren autenticación** mediante token Bearer
2. **Usuarios OAuth** (Google/Microsoft) no pueden cambiar email ni contraseña
3. **El código de verificación expira en 15 minutos**
4. **Después de cambiar el email**, el usuario debe verificar el nuevo email
5. **La nueva contraseña debe tener al menos 8 caracteres**
6. **El email debe tener un formato válido** y no estar en uso por otro usuario

---

## Preguntas Frecuentes

### ¿Puedo cambiar el email de un usuario OAuth?
No. Los usuarios autenticados con Google o Microsoft no pueden cambiar su email ni contraseña mediante la aplicación. Deben hacerlo desde su cuenta de Google/Microsoft.

### ¿Qué pasa si el código de verificación expira?
El código expira después de 15 minutos. El usuario debe solicitar un nuevo código usando el endpoint `/api/users/me/change-email/request/`.

### ¿Puedo actualizar el email directamente en el perfil?
No. El email debe cambiarse mediante el proceso de verificación de dos pasos (solicitar y confirmar).

### ¿Qué campos puedo actualizar en el perfil?
Puedes actualizar: `name`, `paternal_lastname`, `maternal_lastname`, `document_type_id`, `document_number`, `sex`, `phone`, `country_id`, `region_id`, `province_id`, `district_id`.

---

**Última actualización**: Enero 2025

