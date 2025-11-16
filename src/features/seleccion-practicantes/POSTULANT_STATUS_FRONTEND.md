# 📘 Documentación de Postulant Status - Frontend

Esta documentación describe los cambios realizados en las APIs relacionadas con el estado del postulante (`postulant_status`) y cómo el frontend debe implementar la lógica de redirección y control de acceso.

---

## 🎯 Resumen Ejecutivo

### ¿Qué cambió?

Todos los endpoints de autenticación y perfil ahora incluyen dos campos nuevos:
- **`role_id`**: ID del rol del usuario (1=Postulante, 2=Admin)
- **`postulant_status`**: Estado del postulante (1=No aplicado, 2=En proceso, 3=Aceptado)

### ¿Para qué sirve?

El `postulant_status` permite al frontend:
1. **Decidir a dónde redirigir** al usuario después del login/registro
2. **Mostrar/ocultar funcionalidades** según el estado del proceso
3. **Controlar el flujo** de formularios y encuestas

### ⚠️ IMPORTANTE

- **El acceso a APIs sigue siendo por ROL (`role_id`), NO por `postulant_status`**
- `postulant_status` solo indica el estado del proceso
- Un postulante aceptado (`postulant_status = 3`) sigue siendo un postulante con acceso a APIs de postulante, no a APIs de admin

---

## 📊 Campo `postulant_status`

### Valores Posibles

| Valor | Estado | Descripción | Acción en Frontend |
|-------|--------|-------------|-------------------|
| `1` | **No aplicado** | Usuario nuevo que no ha aplicado a ninguna convocatoria | Redirigir a crear primera postulación |
| `2` | **En proceso** | Usuario tiene postulaciones activas, completando formularios/encuestas | Redirigir a formularios/encuestas |
| `3` | **Aceptado** | Usuario fue aceptado en al menos una convocatoria | Redirigir a dashboard de postulante |

### Actualización Automática

El `postulant_status` se actualiza automáticamente:
- **Al crear una postulación** → Cambia de `1` a `2` (En proceso)
- **Al aceptar un postulante** (Admin) → Cambia a `3` (Aceptado)

---

## 🔄 Endpoints Actualizados

### 1. POST /api/auth/register/

**Endpoint:** `POST /api/auth/register/`

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123",
  "name": "Juan",
  "paternal_lastname": "Pérez"
}
```

**Response 201 (Success):**
```json
{
  "message": "Usuario registrado exitosamente como Postulante",
  "user": {
    "id": 123,
    "email": "juan@example.com",
    "username": "juan",
    "name": "Juan",
    "paternal_lastname": "Pérez",
    "role_id": 1,                    // ← NUEVO
    "postulant_status": 1,           // ← NUEVO (siempre 1 para nuevos usuarios)
    "provider": "email"
  },
  "tokens": {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
}
```

**Campos nuevos:**
- `role_id`: Siempre `1` (Postulante) en este endpoint
- `postulant_status`: Siempre `1` (No aplicado) para usuarios nuevos

---

### 2. POST /api/auth/login/

**Endpoint:** `POST /api/auth/login/`

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response 200 (Success):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 123,
    "email": "juan@example.com",
    "username": "juan",
    "role_id": 1,                    // ← NUEVO
    "postulant_status": 2,           // ← NUEVO (puede ser 1, 2 o 3)
    "provider": "email"
  },
  "tokens": {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
}
```

**Campos nuevos:**
- `role_id`: `1` (Postulante) o `2` (Admin)
- `postulant_status`: `1`, `2` o `3` según el estado actual

---

### 3. POST /api/auth/oauth/

**Endpoint:** `POST /api/auth/oauth/`

**Request Body:**
```json
{
  "provider": "google",
  "provider_id": "123456789",
  "email": "juan@gmail.com",
  "name": "Juan Pérez"
}
```

**Response 200 (Success):**
```json
{
  "message": "Autenticación google exitosa",
  "user": {
    "id": 123,
    "email": "juan@gmail.com",
    "username": "juan",
    "name": "Juan",
    "paternal_lastname": "Pérez",
    "role_id": 1,                    // ← NUEVO
    "postulant_status": 1,           // ← NUEVO (1 si es nuevo, o el estado actual si ya existe)
    "provider": "google"
  },
  "tokens": {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
}
```

**Campos nuevos:**
- `role_id`: `1` (Postulante) o `2` (Admin)
- `postulant_status`: Estado actual del usuario (o `1` si es nuevo)

---

### 4. GET /api/users/me/

**Endpoint:** `GET /api/users/me/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200 (Success):**
```json
{
  "id": 123,
  "email": "juan@example.com",
  "username": "juan",
  "name": "Juan",
  "paternal_lastname": "Pérez",
  "role_id": 1,
  "postulant_status": 2,             // ← NUEVO
  "provider": "email",
  "can_change_email": true,
  "can_change_password": true,
  ...
}
```

**Campos nuevos:**
- `postulant_status`: Estado actual del postulante

---

### 5. GET /api/postulants/ y GET /api/postulants/{id}/

**Endpoint:** `GET /api/postulants/` o `GET /api/postulants/{id}/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200 (Success):**
```json
{
  "id": 456,
  "job_posting_id": 5,
  "process_status": "Profile",
  "current_stage": "2. Profile",
  "accepted": false,
  "user_id": 123,
  "user_email": "juan@example.com",
  "user_username": "juan",
  "user_role_id": 1,                 // ← NUEVO
  "user_postulant_status": 2,        // ← NUEVO
  "personal_data": {
    ...
  }
}
```

**Campos nuevos:**
- `user_role_id`: Rol del usuario asociado al postulante
- `user_postulant_status`: Estado del postulante del usuario

---

## 🆕 Nuevo Endpoint

### PATCH /api/users/{user_id}/postulant-status/

Actualiza el estado del postulante de un usuario. **Solo disponible para Administradores.**

**Endpoint:** `PATCH /api/users/{user_id}/postulant-status/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "postulant_status": 2
}
```

**Valores válidos:**
- `1` - No aplicado
- `2` - En proceso
- `3` - Aceptado

**Response 200 (Success):**
```json
{
  "message": "Estado del postulante actualizado exitosamente",
  "user_id": 123,
  "postulant_status": 2
}
```

**Response 400 (Error):**
```json
{
  "error": "postulant_status debe ser 1, 2 o 3"
}
```

**Response 403 (Forbidden):**
```json
{
  "error": "No tienes permiso para realizar esta acción"
}
```

**Ejemplo con fetch:**
```javascript
const response = await fetch(`/api/users/${userId}/postulant-status/`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    postulant_status: 3  // Aceptar postulante
  }),
});

const data = await response.json();
```

---

## 🧭 Flujo de Redirección

### Lógica de Redirección Recomendada

Después de cualquier autenticación (login, oauth, register), el frontend debe verificar `role_id` y `postulant_status` para decidir a dónde redirigir:

```javascript
function redirectUser(user) {
  // Paso 1: Verificar si es Admin
  if (user.role_id === 2) {
    // Admin → Dashboard de Admin
    router.push('/admin/dashboard');
    return;
  }

  // Paso 2: Si es Postulante, verificar estado
  if (user.role_id === 1) {
    switch (user.postulant_status) {
      case 3:
        // Aceptado → Dashboard de Postulante (con acceso completo)
        router.push('/postulant/dashboard');
        break;
        
      case 2:
        // En proceso → Continuar con formularios/encuestas
        router.push('/postulant/forms');
        break;
        
      case 1:
      default:
        // No aplicado → Crear primera postulación
        router.push('/postulant/create-application');
        break;
    }
  }
}
```

### Diagrama de Flujo Visual

```
                    ┌─────────────────────┐
                    │   LOGIN/REGISTER    │
                    │      / OAUTH        │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Respuesta incluye: │
                    │  - role_id          │
                    │  - postulant_status │
                    └─────────────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │   ¿role_id === 2? (Admin)   │
                └─────────────────────────────┘
                          │           │
                    SÍ    │           │    NO
                          ▼           ▼
                ┌─────────────┐  ┌──────────────────────┐
                │   Dashboard │  │ ¿postulant_status?   │
                │    Admin    │  └──────────────────────┘
                │             │           │
                │ Acceso a    │    ┌──────┴──────┬──────────┐
                │ APIs Admin  │    3             2          1
                └─────────────┘    │             │          │
                                   ▼             ▼          ▼
                          ┌──────────┐  ┌──────────┐  ┌──────────────┐
                          │Dashboard │  │Formularios│  │Crear         │
                          │Postulante│  │/Encuestas │  │Postulación   │
                          │          │  │           │  │              │
                          │Acceso a  │  │Completar  │  │Primera vez   │
                          │APIs de   │  │proceso    │  │              │
                          │Postulante│  │           │  │              │
                          └──────────┘  └──────────┘  └──────────────┘
```

---

## 💻 Ejemplos de Implementación

### Ejemplo 1: Función de Login Completa (React/Vue/Angular)

```javascript
// Función de login
async function login(email, password) {
  try {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // Guardar tokens
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);

    // Guardar información del usuario
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirigir según role_id y postulant_status
    redirectUser(data.user);
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Función de redirección
function redirectUser(user) {
  if (user.role_id === 2) {
    // Admin → Dashboard de Admin
    window.location.href = '/admin/dashboard';
    
  } else if (user.role_id === 1) {
    // Postulante
    if (user.postulant_status === 3) {
      // Aceptado → Dashboard de Postulante
      window.location.href = '/postulant/dashboard';
      
    } else if (user.postulant_status === 2) {
      // En proceso → Formularios/Encuestas
      window.location.href = '/postulant/forms';
      
    } else {
      // No aplicado (1 o null) → Crear primera postulación
      window.location.href = '/postulant/create-application';
    }
  }
}
```

### Ejemplo 2: Hook/Composable para Estado del Usuario

```javascript
// React Hook
import { useState, useEffect } from 'react';

function useUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/api/users/me/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading };
}

// Uso en componente
function MyComponent() {
  const { user, loading } = useUserProfile();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>No se pudo cargar el usuario</div>;

  return (
    <div>
      <p>Rol: {user.role_id === 2 ? 'Admin' : 'Postulante'}</p>
      <p>Estado: {
        user.postulant_status === 3 ? 'Aceptado' :
        user.postulant_status === 2 ? 'En proceso' :
        'No aplicado'
      }</p>
    </div>
  );
}
```

### Ejemplo 3: Guard/Interceptor para Proteger Rutas

```javascript
// Vue Router Guard
function requireAcceptedPostulant(to, from, next) {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    next('/login');
    return;
  }

  fetch('/api/users/me/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(user => {
      if (user.role_id === 1 && user.postulant_status === 3) {
        // Postulante aceptado, permitir acceso
        next();
      } else if (user.role_id === 1 && user.postulant_status === 2) {
        // En proceso, redirigir a formularios
        next('/postulant/forms');
      } else if (user.role_id === 1) {
        // No aplicado, redirigir a crear postulación
        next('/postulant/create-application');
      } else {
        // Admin u otro rol, permitir acceso
        next();
      }
    })
    .catch(() => {
      next('/login');
    });
}

// Uso en rutas
const routes = [
  {
    path: '/postulant/advanced-features',
    component: AdvancedFeatures,
    beforeEnter: requireAcceptedPostulant,
  },
];
```

### Ejemplo 4: OAuth Login (Google/Microsoft)

```javascript
async function oauthLogin(provider, providerData) {
  try {
    const response = await fetch('/api/auth/oauth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: provider, // 'google' o 'microsoft'
        provider_id: providerData.id,
        email: providerData.email,
        name: providerData.name,
        paternal_lastname: providerData.paternal_lastname,
        maternal_lastname: providerData.maternal_lastname,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en autenticación OAuth');
    }

    // Guardar tokens
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirigir según estado
    redirectUser(data.user);
    
    return data;
  } catch (error) {
    console.error('Error en OAuth login:', error);
    throw error;
  }
}
```

### Ejemplo 5: Actualizar Estado (Solo Admin)

```javascript
// Función para que un admin actualice el estado de un postulante
async function updatePostulantStatus(userId, postulantStatus) {
  const token = localStorage.getItem('access_token');
  
  try {
    const response = await fetch(`/api/users/${userId}/postulant-status/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postulant_status: postulantStatus, // 1, 2, o 3
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar estado');
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uso: Aceptar un postulante
await updatePostulantStatus(123, 3); // Cambiar a "Aceptado"
```

### Ejemplo 6: Verificar Estado en Componente

```javascript
// Componente que muestra diferentes opciones según el estado
function PostulantDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/users/me/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const userData = await response.json();
      setUser(userData);
    }
    loadUser();
  }, []);

  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      {user.role_id === 1 && (
        <>
          {user.postulant_status === 3 && (
            <div>
              <h2>Dashboard de Postulante Aceptado</h2>
              <button onClick={() => router.push('/postulant/advanced-features')}>
                Funcionalidades Avanzadas
              </button>
            </div>
          )}
          
          {user.postulant_status === 2 && (
            <div>
              <h2>Completa tu Proceso de Postulación</h2>
              <p>Debes completar los formularios y encuestas.</p>
              <button onClick={() => router.push('/postulant/forms')}>
                Continuar con Formularios
              </button>
            </div>
          )}
          
          {user.postulant_status === 1 && (
            <div>
              <h2>Bienvenido</h2>
              <p>Comienza postulándote a una convocatoria.</p>
              <button onClick={() => router.push('/postulant/create-application')}>
                Crear Postulación
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## 🔐 Control de Acceso a APIs

### ⚠️ IMPORTANTE: El acceso a APIs es por ROL, NO por `postulant_status`

- **Postulante (`role_id = 1`)** → Acceso a APIs de Postulante (siempre, independiente de `postulant_status`)
- **Admin (`role_id = 2`)** → Acceso a APIs de Admin

El `postulant_status` solo se usa para:
- Decidir redirección en el frontend
- Mostrar/ocultar funcionalidades
- Controlar el flujo de formularios

### APIs Disponibles por Rol

#### Postulante (role_id = 1) - Siempre Disponibles

Independiente de `postulant_status`, un postulante puede acceder a:
- `GET /api/users/me/` - Ver perfil
- `PATCH /api/users/me/` - Actualizar perfil
- `POST /api/postulants/` - Crear postulación
- `GET /api/postulants/` - Ver mis postulaciones
- `POST /api/postulants/{id}/personal-data/` - Guardar datos personales
- `POST /api/postulants/{id}/survey-responses/` - Guardar encuestas
- `GET /api/postulants/{id}/survey-responses/` - Ver encuestas
- `GET /api/evaluations/{id}/view/` - Ver evaluaciones
- `POST /api/evaluation-attempts/{id}/answers/` - Responder evaluaciones
- `GET /api/dashboard/postulants/my-progress/` - Ver mi progreso

**APIs adicionales (solo si `postulant_status = 3`):**
- Estas APIs las definirás según tus necesidades
- El frontend puede verificar `postulant_status === 3` antes de mostrar opciones para estas APIs

#### Admin (role_id = 2) - Siempre Disponibles

- Todas las APIs de Admin
- Dashboard completo
- Gestión de usuarios, convocatorias, etc.

---

## 📋 Checklist de Implementación

### ✅ Cambios Requeridos en el Frontend

- [ ] **Actualizar función de login**
  - [ ] Leer `role_id` de la respuesta
  - [ ] Leer `postulant_status` de la respuesta
  - [ ] Implementar lógica de redirección

- [ ] **Actualizar función de registro**
  - [ ] Leer `role_id` y `postulant_status` de la respuesta
  - [ ] Redirigir según estado

- [ ] **Actualizar función de OAuth**
  - [ ] Leer `role_id` y `postulant_status` de la respuesta
  - [ ] Redirigir según estado

- [ ] **Actualizar componente de perfil**
  - [ ] Mostrar `postulant_status` al usuario
  - [ ] Mostrar estado legible (No aplicado/En proceso/Aceptado)

- [ ] **Implementar guards/interceptors**
  - [ ] Proteger rutas según `postulant_status`
  - [ ] Redirigir automáticamente si el estado no permite acceso

- [ ] **Actualizar componentes que consumen GET `/api/postulants/`**
  - [ ] Usar `user_postulant_status` si es necesario
  - [ ] Usar `user_role_id` si es necesario

- [ ] **Implementar UI para Admin (opcional)**
  - [ ] Formulario para actualizar `postulant_status`
  - [ ] Lista de usuarios con su estado
  - [ ] Botón para aceptar/rechazar postulantes

- [ ] **Actualizar tipos/interfaces TypeScript (si aplica)**
  - [ ] Agregar `role_id` a tipo User
  - [ ] Agregar `postulant_status` a tipo User
  - [ ] Agregar `user_role_id` y `user_postulant_status` a tipo Postulant

---

## 🔄 Flujo Completo de Usuario

### Escenario 1: Usuario Nuevo se Registra

```
1. Usuario se registra → POST /api/auth/register/
2. Backend responde con:
   - role_id: 1
   - postulant_status: 1 (No aplicado)
3. Frontend redirige a: /postulant/create-application
```

### Escenario 2: Usuario Crea Postulación

```
1. Usuario crea postulación → POST /api/postulants/
2. Backend actualiza automáticamente:
   - postulant_status: 1 → 2 (En proceso)
3. Frontend puede verificar estado con GET /api/users/me/
4. Frontend redirige a: /postulant/forms
```

### Escenario 3: Usuario Completa Formularios

```
1. Usuario completa encuestas → POST /api/postulants/{id}/survey-responses/
2. postulant_status sigue siendo 2 (En proceso)
3. Frontend continúa mostrando formularios
```

### Escenario 4: Admin Acepta Postulante

```
1. Admin acepta postulante → POST /api/postulants/{id}/accept/
2. Backend actualiza automáticamente:
   - Postulant.accepted: true
   - User.postulant_status: 2 → 3 (Aceptado)
3. Usuario hace login → POST /api/auth/login/
4. Backend responde con postulant_status: 3
5. Frontend redirige a: /postulant/dashboard
```

---

## 🧪 Ejemplos de Testing

### Test 1: Login de Postulante No Aplicado

```javascript
// Mock response
const mockResponse = {
  user: {
    role_id: 1,
    postulant_status: 1,
  },
};

// Verificar redirección
expect(redirectUser(mockResponse.user)).toNavigateTo('/postulant/create-application');
```

### Test 2: Login de Postulante Aceptado

```javascript
// Mock response
const mockResponse = {
  user: {
    role_id: 1,
    postulant_status: 3,
  },
};

// Verificar redirección
expect(redirectUser(mockResponse.user)).toNavigateTo('/postulant/dashboard');
```

### Test 3: Login de Admin

```javascript
// Mock response
const mockResponse = {
  user: {
    role_id: 2,
    postulant_status: 1, // No importa para admin
  },
};

// Verificar redirección
expect(redirectUser(mockResponse.user)).toNavigateTo('/admin/dashboard');
```

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si un usuario tiene múltiples postulaciones?

El `postulant_status` es un estado **global** del usuario. Si tiene múltiples postulaciones:
- Si al menos una está aceptada → `postulant_status = 3`
- Si tiene postulaciones en proceso → `postulant_status = 2`
- Si todas fueron rechazadas → `postulant_status = 1` o `2` (según lógica)

### ¿Puedo cambiar manualmente el `postulant_status`?

Sí, los administradores pueden usar el endpoint `PATCH /api/users/{id}/postulant-status/` para cambiar el estado manualmente.

### ¿El `postulant_status` afecta el acceso a APIs?

**NO**. El acceso a APIs sigue siendo por `role_id`. El `postulant_status` solo se usa para:
- Decidir redirección en el frontend
- Mostrar/ocultar funcionalidades
- Controlar el flujo de formularios

### ¿Qué pasa cuando un admin acepta un postulante?

Automáticamente:
1. `Postulant.accepted = true`
2. `Postulant.process_status = "Accepted"`
3. `User.postulant_status = 3` (Aceptado) ← Se actualiza automáticamente

### ¿Qué pasa si un usuario OAuth (Google/Microsoft) se registra?

Los usuarios OAuth también tienen `postulant_status`:
- Si es nuevo → `postulant_status = 1` (No aplicado)
- Si ya existe → Mantiene su `postulant_status` actual

---

## 📝 Resumen de Campos en Respuestas

### Endpoints de Autenticación

Todos incluyen en `user`:
- `role_id` (integer): 1=Postulante, 2=Admin
- `postulant_status` (integer): 1=No aplicado, 2=En proceso, 3=Aceptado

### GET /api/users/me/

Incluye:
- `postulant_status` (integer)
- `role_id` (integer)
- `can_change_email` (boolean)
- `can_change_password` (boolean)
- `provider` (string)

### GET /api/postulants/ y GET /api/postulants/{id}/

Incluyen:
- `user_role_id` (integer)
- `user_postulant_status` (integer)

---

## 🚀 Próximos Pasos

1. **Ejecutar migración en backend:**
   ```bash
   python manage.py migrate
   ```

2. **Actualizar funciones de autenticación** en el frontend para leer `role_id` y `postulant_status`

3. **Implementar lógica de redirección** basada en `role_id` y `postulant_status`

4. **Actualizar guards/interceptors** para proteger rutas según `postulant_status`

5. **Probar el flujo completo:**
   - Registro → Verificar redirección
   - Crear postulación → Verificar cambio de estado
   - Login después de aceptación → Verificar redirección a dashboard

---

**Última actualización**: Enero 2025

**Contacto**: Para dudas sobre la implementación, consultar con el equipo de backend.
