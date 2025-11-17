<div align="center">

# Selección de Practicantes

<div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.4); border: 1px solid #3a3a3a;">

<h1 style="color: white; margin: 0; font-size: 2.5rem; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Sistema de Selección de Practicantes</h1>

<p style="color: rgba(255,255,255,0.85); margin-top: 1rem; font-size: 1.1rem; line-height: 1.6;">Módulo integral para la gestión completa del proceso de selección, reclutamiento y administración de practicantes para practicantes en RPSoft</p>

</div>

</div>

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Módulo](#arquitectura-del-módulo)
- [Módulos y Funcionalidades](#módulos-y-funcionalidades)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Sistema de Rutas](#sistema-de-rutas)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Componentes Principales](#componentes-principales)
- [Servicios y APIs](#servicios-y-apis)
- [Estado y Gestión de Datos](#estado-y-gestión-de-datos)

---

## Descripción General

El módulo de **Selección de Practicantes** es el núcleo del sistema RP SOFT, diseñado para gestionar de manera integral todo el ciclo de vida del proceso de selección y reclutamiento de practicantes. Proporciona herramientas completas para administradores, evaluadores y postulantes, facilitando desde la publicación de convocatorias hasta la gestión de evaluaciones y documentación.

### Características Principales

- Gestión completa de convocatorias públicas y privadas
- Sistema de postulación multi-etapa con formularios dinámicos
- Administración de CVs y documentos
- Sistema de evaluaciones técnicas y psicológicas
- Calendario de entrevistas y reuniones
- Dashboard con métricas y estadísticas en tiempo real
- Control de acceso basado en roles y permisos
- Autenticación mediante múltiples proveedores OAuth

---

## Arquitectura del Módulo

### Estructura Modular

El módulo sigue una arquitectura de features con separación clara de responsabilidades:

```
seleccion-practicantes/
├── components/          # Componentes compartidos del módulo
├── modules/            # Submódulos funcionales independientes
├── routes/             # Configuración de rutas
├── services/           # Servicios API compartidos
├── hooks/              # Hooks personalizados
├── store/              # Estado global del módulo
└── shared/             # Utilidades y componentes compartidos
```

### Principios de Diseño

- **Modularidad**: Cada submódulo es independiente y autocontenido
- **Reutilización**: Componentes y servicios compartidos en `shared`
- **Separación de Concerns**: Lógica de negocio separada de la presentación
- **Escalabilidad**: Estructura que permite agregar nuevas funcionalidades fácilmente

---

## Módulos y Funcionalidades

### Dashboard

Panel principal que proporciona una visión general del sistema con métricas clave, gráficos de progreso y actividades recientes.

**Componentes:**
- Tarjetas de estadísticas (convocatorias, postulantes, evaluaciones)
- Gráficos de distribución por especialidad
- Gráficos de progreso por convocatoria
- Gráficos de estado de postulantes
- Lista de usuarios recientes
- Actividades recientes del sistema
- Próximas entrevistas programadas

**Ruta:** `/seleccion-practicantes`

### Autenticación

Sistema completo de autenticación con múltiples proveedores y gestión de sesiones.

**Funcionalidades:**
- Login con email y contraseña
- OAuth con Google
- OAuth con Microsoft (Azure AD)
- Registro de usuarios
- Registro de administradores
- Recuperación de contraseña
- Cambio de contraseña
- Redirección inteligente según rol y estado

**Rutas:**
- `/` - Login
- `/register` - Registro
- `/admin/register` - Registro de administrador
- `/forgot-password` - Recuperación de contraseña
- `/reset-password` - Restablecer contraseña
- `/auth/callback` - Callback OAuth

### Convocatorias

Gestión completa de convocatorias de prácticas profesionales.

**Funcionalidades:**
- Creación y edición de convocatorias
- Publicación pública y privada
- Visualización de convocatorias activas
- Filtrado y búsqueda avanzada
- Gestión de estados (abierta, cerrada, en proceso)
- Asignación de especialidades y requisitos

**Ruta:** `/seleccion-practicantes/convocatorias`

### Postulantes

Administración centralizada de todos los postulantes del sistema.

**Funcionalidades:**
- Listado completo de postulantes
- Filtrado por estado, especialidad, convocatoria
- Vista detallada de cada postulante
- Gestión de estados de postulación
- Historial de cambios y actualizaciones
- Exportación de datos

**Ruta:** `/seleccion-practicantes/postulantes`

### Formulario de Postulación

Sistema multi-paso para que los postulantes completen su aplicación.

**Etapas:**
1. Datos Personales
2. Perfil Profesional
3. Motivación
4. Evaluación Psicológica
5. Evaluación Técnica
6. Carga de CV
7. Confirmación

**Ruta:** `/seleccion-practicantes/postulacion`

### Gestión de CVs

Sistema para visualizar y administrar los currículums de los postulantes.

**Funcionalidades:**
- Visualización de CVs por postulante
- Vista previa de documentos
- Descarga de archivos
- Filtrado y búsqueda
- Panel administrativo para gestión masiva

**Rutas:**
- `/seleccion-practicantes/cvs` - Vista de usuario
- `/seleccion-practicantes/cvs-admin` - Panel administrativo

### Evaluaciones

Sistema completo de evaluaciones técnicas y psicológicas.

**Funcionalidades:**
- Creación de evaluaciones
- Asignación a postulantes
- Seguimiento de resultados
- Historial de evaluaciones
- Reportes y estadísticas

**Ruta:** `/seleccion-practicantes/evaluaciones`

### Calendario

Gestión de entrevistas, reuniones y eventos relacionados con el proceso de selección.

**Funcionalidades:**
- Vista de calendario mensual y semanal
- Programación de entrevistas
- Gestión de participantes
- Recordatorios y notificaciones
- Integración con reuniones

**Ruta:** `/seleccion-practicantes/calendario`

### Historial

Registro completo de todas las actividades y cambios en el sistema.

**Funcionalidades:**
- Log de actividades por usuario
- Filtrado por tipo de acción
- Filtrado por fecha
- Vista detallada de cada actividad
- Exportación de registros

**Ruta:** `/seleccion-practicantes/historial`

### Administración

Módulos administrativos para la configuración del sistema (solo administradores).

#### Usuarios

Gestión completa de usuarios del sistema.

**Ruta:** `/seleccion-practicantes/usuarios`

#### Roles

Administración de roles y permisos.

**Ruta:** `/seleccion-practicantes/roles`

#### Especialidades

Gestión de especialidades disponibles para las convocatorias.

**Ruta:** `/seleccion-practicantes/especialidades`

#### Tipos de Documento

Configuración de tipos de documentos aceptados en el sistema.

**Ruta:** `/seleccion-practicantes/tipos-documento`

### Perfil de Usuario

Gestión del perfil personal de cada usuario.

**Funcionalidades:**
- Visualización de información personal
- Actualización de datos
- Cambio de contraseña
- Cambio de email
- Carga de foto de perfil

**Ruta:** `/seleccion-practicantes/perfil`

---

## Estructura de Carpetas


```
seleccion-practicantes/
│
├── components/              # Componentes compartidos del módulo
│   ├── Layout/             # Layout principal con Sidebar
│   └── Sidebar/            # Sidebar con navegación
│
├── modules/                 # Submódulos funcionales
│   ├── auth/               # Autenticación y autorización
│   ├── dashboard/          # Dashboard principal
│   ├── convocatorias/      # Gestión de convocatorias
│   ├── postulantes/        # Administración de postulantes
│   ├── Practicante-Form/   # Formulario de postulación
│   ├── cv/                 # Gestión de CVs (usuario)
│   ├── cvs-admin/          # Administración de CVs
│   ├── evaluaciones/       # Sistema de evaluaciones
│   ├── Calendario/         # Calendario de entrevistas
│   ├── historial/          # Historial de actividades
│   ├── perfil/             # Perfil de usuario
│   ├── usuarios/           # Gestión de usuarios (admin)
│   ├── roles/              # Gestión de roles (admin)
│   ├── especialidades/     # Gestión de especialidades (admin)
│   └── tipos-documento/    # Tipos de documento (admin)
│
├── routes/                  # Configuración de rutas
│   ├── router.jsx          # Router principal del módulo
│   └── RequireRole.jsx     # Guard de rutas por rol
│
├── services/                # Servicios API
│   ├── baseUrl.js          # URL base de la API
│   ├── methods.js          # Métodos HTTP
│   └── index.js            # Exportaciones
│
├── hooks/                   # Hooks personalizados
├── store/                   # Estado global (Zustand)
├── shared/                  # Recursos compartidos
│   ├── components/         # Componentes compartidos
│   └── utils/              # Utilidades
│
└── pages/                   # Páginas principales
    └── Dashboard.jsx       # Dashboard del módulo
```



### Estructura de un Submódulo

Cada submódulo sigue una estructura consistente:

```
module-name/
├── components/          # Componentes específicos
│   └── ComponentName/
│       ├── ComponentName.jsx
│       ├── ComponentName.module.css
│       └── index.js
├── pages/              # Páginas del submódulo
│   ├── ModulePage.jsx
│   ├── ModulePage.module.css
│   └── index.js
├── hooks/              # Hooks personalizados
│   └── useModule.js
├── services/           # Servicios API
│   └── moduleService.js
└── store/              # Estado local (opcional)
```

---

## Sistema de Rutas

### Rutas Públicas

Rutas accesibles sin autenticación:

- `/seleccion-practicantes/postulacion` - Formulario de postulación

### Rutas Protegidas

Rutas que requieren autenticación:

**Rutas Generales:**
- `/seleccion-practicantes` - Dashboard
- `/seleccion-practicantes/convocatorias` - Convocatorias
- `/seleccion-practicantes/postulantes` - Postulantes
- `/seleccion-practicantes/cvs` - CVs
- `/seleccion-practicantes/evaluaciones` - Evaluaciones
- `/seleccion-practicantes/calendario` - Calendario
- `/seleccion-practicantes/historial` - Historial
- `/seleccion-practicantes/perfil` - Perfil

**Rutas de Administrador:**
- `/seleccion-practicantes/cvs-admin` - Administración de CVs
- `/seleccion-practicantes/usuarios` - Gestión de usuarios
- `/seleccion-practicantes/roles` - Gestión de roles
- `/seleccion-practicantes/especialidades` - Especialidades
- `/seleccion-practicantes/tipos-documento` - Tipos de documento

### Guards de Rutas

El componente `RequireRole` protege las rutas administrativas:

```jsx
<RequireRole requireAdmin={true}>
  <AdminComponent />
</RequireRole>
```

---

## Autenticación y Autorización

### Métodos de Autenticación

1. **Email y Contraseña**: Autenticación tradicional
2. **Google OAuth**: Integración con Google Accounts
3. **Microsoft OAuth**: Integración con Azure AD

### Sistema de Roles

El sistema maneja dos roles principales:

- **Administrador (role_id: 2)**: Acceso completo a todas las funcionalidades
- **Postulante (role_id: 1)**: Acceso limitado según estado de postulación

### Estados de Postulante

- **Estado 1**: No aplicado - Acceso al formulario de postulación
- **Estado 2**: En proceso - Acceso a formularios y evaluaciones
- **Estado 3**: Aceptado - Acceso completo al dashboard

### Redirección por Rol

La función `redirectByRole` redirige automáticamente según:
- Rol del usuario (admin/postulante)
- Estado de postulación
- Configuración del sistema

---

## Componentes Principales

### Layout

Componente contenedor principal que incluye:
- Sidebar con navegación
- Header con información del usuario
- Área de contenido principal
- Footer con información de sesión

### Sidebar

Navegación lateral con:
- Secciones colapsables
- Indicadores de ruta activa
- Botón de volver al dashboard principal
- Filtrado de opciones según permisos

### Dashboard Components

- **StatsCard**: Tarjetas de estadísticas
- **ProgressDistributionChart**: Gráfico de distribución
- **ProgressByStageChart**: Progreso por etapa
- **ProgressBySpecialtyChart**: Progreso por especialidad
- **PostulantsStatusChart**: Estado de postulantes
- **ConvocatoriasStatusChart**: Estado de convocatorias
- **RecentActivity**: Actividades recientes
- **NewUsersList**: Lista de nuevos usuarios
- **UpcomingInterviews**: Próximas entrevistas

---

## Servicios y APIs

### Servicios Principales

- **authService**: Autenticación y gestión de sesiones
- **convocatoriaService**: Gestión de convocatorias
- **postulanteService**: Administración de postulantes
- **evaluacionService**: Sistema de evaluaciones
- **calendarioService**: Gestión de calendario
- **fileService**: Gestión de archivos y CVs
- **dashboardService**: Datos del dashboard
- **historialService**: Registro de actividades

### Configuración de API

El servicio base utiliza:
- URL base configurable
- Interceptores para tokens
- Manejo centralizado de errores
- Refresh token automático

---

## Estado y Gestión de Datos

### Estado Global

- **React Context**: Para datos de usuario y autenticación
- **Zustand**: Para estado de módulos específicos
- **LocalStorage**: Persistencia de preferencias
- **Cookies**: Tokens de autenticación

### Flujo de Datos

1. Componentes solicitan datos mediante hooks
2. Hooks llaman a servicios API
3. Servicios realizan peticiones HTTP
4. Respuestas se almacenan en estado (Context/Zustand)
5. Componentes se actualizan reactivamente

---

## Tecnologías Utilizadas

<div style="display: flex; flex-direction: column; gap: 1.5rem; margin: 2rem 0;">

<div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">

<div style="flex: 1; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 2rem; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-left: 4px solid #4a4a4a;">

**Frontend**
- React 19
- React Router DOM
- Tailwind CSS
- CSS Modules

</div>

<div style="flex: 1;"></div>

</div>

<div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">

<div style="flex: 1;"></div>

<div style="flex: 1; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); padding: 2rem; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-right: 4px solid #4a4a4a;">

**Estado**
- Zustand
- React Context
- LocalStorage

</div>

</div>

<div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">

<div style="flex: 1; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 2rem; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-left: 4px solid #4a4a4a;">

**HTTP**
- Axios
- Interceptores
- Refresh Tokens

</div>

<div style="flex: 1;"></div>

</div>

<div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">

<div style="flex: 1;"></div>

<div style="flex: 1; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); padding: 2rem; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-right: 4px solid #4a4a4a;">

**Autenticación**
- OAuth 2.0
- Azure MSAL
- Google OAuth
- JWT Tokens

</div>

</div>

<div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">

<div style="flex: 1; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 2rem; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-left: 4px solid #4a4a4a;">

**UI**
- Lucide React
- Ant Design
- Recharts
- React DatePicker

</div>

<div style="flex: 1;"></div>

</div>

<div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">

<div style="flex: 1;"></div>

<div style="flex: 1; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); padding: 2rem; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-right: 4px solid #4a4a4a;">

**Utilidades**
- clsx
- React Icons
- ExcelJS
- jsPDF

</div>

</div>

</div>

---

## Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`PostulanteCard.jsx`)
- **Hooks**: camelCase con prefijo `use` (`usePostulantes.js`)
- **Servicios**: camelCase con sufijo `Service` (`postulanteService.js`)
- **Estilos**: CSS Modules con sufijo `.module.css`

### Estructura de Componentes

```jsx
// Imports externos
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports internos
import { ComponentName } from './components'
import { useCustomHook } from '../hooks'
import styles from './Component.module.css'

// Componente
export function ComponentName() {
  // Hooks
  // Estado
  // Funciones
  // Render
}
```

### Manejo de Errores

- Try-catch en servicios
- Manejo centralizado de errores HTTP
- Mensajes de error user-friendly
- Logging para debugging

---





