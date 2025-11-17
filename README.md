# RP SOFT

Sistema integral de gestión para prácticas profesionales desarrollado para SENATI. Plataforma web modular que centraliza la administración de practicantes, evaluaciones, asistencia, tareas y documentación.

<div align="center">

### Stack Tecnológico

**Frontend & UI**

<img src="https://skillicons.dev/icons?i=react,js,ts,html,css,tailwind,vite&theme=dark" />

=

**Herramientas & Despliegue**

<img src="https://skillicons.dev/icons?i=git,github,vercel,vscode,figma,nodejs&theme=dark" />

</div>

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Principales](#módulos-principales)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Estructura de Carpetas](#estructura-de-carpetas)

## Descripción General

RP SOFT es una aplicación web de gestión empresarial diseñada para optimizar los procesos administrativos y operativos relacionados con la gestión de practicantes, evaluaciones, asistencia y documentación. El sistema está construido con una arquitectura modular que permite la escalabilidad y mantenibilidad del código.

## Arquitectura

### Arquitectura Modular por Features

El proyecto sigue una arquitectura basada en features (módulos de funcionalidad), donde cada feature es independiente y contiene toda la lógica relacionada con su dominio específico. Esta estructura facilita el desarrollo paralelo, el mantenimiento y la escalabilidad.

### Principios de Diseño

- **Separación de Responsabilidades**: Cada módulo gestiona su propia lógica de negocio, componentes, servicios y rutas
- **Reutilización de Componentes**: Componentes compartidos en `src/shared` para mantener consistencia en toda la aplicación
- **Lazy Loading**: Carga diferida de módulos para optimizar el rendimiento inicial
- **Context API**: Gestión de estado global mediante React Context para datos compartidos
- **Routing Modular**: Cada feature tiene su propio router interno que se integra con el router principal

### Capas de la Aplicación

1. **Capa de Presentación**: Componentes React organizados por feature
2. **Capa de Lógica de Negocio**: Hooks personalizados y servicios
3. **Capa de Datos**: Servicios API y gestión de estado (Zustand)
4. **Capa de Infraestructura**: Configuración, utilidades y adaptadores

## Tecnologías

### Frontend

- **React 19.1.1**: Biblioteca principal para la construcción de interfaces
- **React Router DOM 7.9.5**: Enrutamiento y navegación
- **Vite 7.1.7**: Herramienta de construcción y desarrollo
- **Tailwind CSS 4.1.16**: Framework de estilos utility-first
- **Zustand 5.0.8**: Gestión de estado ligera
- **Axios 1.13.2**: Cliente HTTP para peticiones API
- **Lucide React 0.552.0**: Biblioteca de iconos
- **Recharts 3.4.1**: Biblioteca de gráficos y visualizaciones
- **Ant Design 5.28.1**: Componentes UI adicionales

### Autenticación y Seguridad

- **Azure MSAL Browser 4.26.1**: Integración con Microsoft Azure AD
- **OAuth 2.0**: Autenticación mediante Google y Microsoft

### Utilidades

- **ExcelJS 4.4.0**: Generación y manipulación de archivos Excel
- **jsPDF 3.0.3**: Generación de documentos PDF
- **React DatePicker 8.8.0**: Componente de selección de fechas
- **QRCode React 4.2.0**: Generación de códigos QR

### Desarrollo

- **ESLint 9.36.0**: Linter para mantener calidad de código
- **PostCSS 8.5.6**: Procesamiento de CSS
- **TypeScript**: Tipado estático (parcial)

## Estructura del Proyecto

```
RP_SOFT/
├── src/
│   ├── app/                    # Configuración de la aplicación
│   │   ├── config/            # Configuraciones globales
│   │   ├── guards/            # Guards de rutas
│   │   ├── middleware/        # Middleware de aplicación
│   │   ├── providers/         # Proveedores de contexto
│   │   ├── routes/            # Router principal
│   │   ├── store/             # Store global
│   │   └── validators/        # Validadores
│   ├── features/              # Módulos de funcionalidad
│   │   ├── agente-integrador/
│   │   ├── asistencia-horario/
│   │   ├── convenios-constancias/
│   │   ├── dataset-transcripcion/
│   │   ├── evaluacion-360/
│   │   ├── gestion-tareas/
│   │   ├── seleccion-practicantes/
│   │   └── transcripcion-reuniones/
│   ├── shared/                # Recursos compartidos
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # Contextos globales
│   │   ├── services/          # Servicios compartidos
│   │   ├── utils/             # Utilidades
│   │   └── types/             # Tipos TypeScript
│   ├── assets/                # Recursos estáticos
│   ├── App.jsx                # Componente raíz
│   └── main.jsx               # Punto de entrada
├── public/                    # Archivos públicos
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración de Vite
└── vercel.json                # Configuración de despliegue
```

## Módulos Principales

### Selección de Practicantes

Sistema completo de gestión del proceso de selección y reclutamiento de practicantes. Incluye gestión de convocatorias, postulantes, CVs, evaluaciones, calendario de entrevistas y administración de usuarios y roles.

**Submódulos:**
- Dashboard con métricas y estadísticas
- Gestión de convocatorias públicas y privadas
- Administración de postulantes y estados
- Visualización y gestión de CVs
- Sistema de evaluaciones técnicas y psicológicas
- Calendario de reuniones y entrevistas
- Gestión de usuarios, roles y permisos
- Configuración de especialidades y tipos de documento
- Historial de actividades

### Asistencia y Horario

Módulo para el control y seguimiento de asistencia, puntualidad y gestión de horarios de practicantes.

**Submódulos:**
- Dashboard de asistencia
- Control de asistencias con justificaciones
- Gestión de horarios y calendarios
- Seguimiento disciplinario
- Historial de practicantes
- Reportes y estadísticas
- Vista de inicio para practicantes

### Gestión de Tareas

Sistema de gestión de proyectos estilo Scrum/Kanban para la organización y seguimiento de tareas y sprints.

**Submódulos:**
- Dashboard de proyectos
- Backlog de historias de usuario
- Tablero de Sprint (Kanban)
- Repositorio de historias
- Métricas y análisis de rendimiento
- Vista de usuario con tareas personales
- Gestión de equipos
- Sistema de feedback

### Evaluación 360

Sistema de evaluación integral que permite evaluaciones desde múltiples perspectivas (autoevaluación, pares, supervisores).

**Submódulos:**
- Evaluación 360 para administradores
- Evaluación 360 para usuarios
- Evaluación individual
- Evaluación técnica
- Gestión de eventos de evaluación
- Visualización de notas 360

### Convenios y Constancias

Módulo para la gestión de convenios de prácticas y generación de constancias y documentos oficiales.

**Submódulos:**
- Dashboard de convenios
- Revisión y validación de documentos
- Gestión de convenios activos
- Generación de constancias
- Configuración de plantillas y firmas
- Auditoría de documentos
- Vista de usuario para carga de documentos

### Transcripción de Reuniones

Sistema para la transcripción, almacenamiento y análisis de reuniones y sesiones de trabajo.

**Submódulos:**
- Daily Scrum: Transcripción y análisis de reuniones diarias
- Scrum de Scrum: Vista agregada de múltiples equipos
- Panel Central: Biblioteca de transcripciones
- Gestión de grabaciones y transcripciones

### Agente Integrador

Asistente inteligente basado en IA (Google Gemini) que integra funcionalidades de todos los módulos mediante conversación natural.

**Características:**
- Chat interactivo con IA
- Integración con todos los módulos del sistema
- Configuración de prompts y roles
- Historial de conversaciones
- Carga de archivos para análisis
- Paneles diferenciados para administradores y usuarios



## Configuración

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las configuraciones necesarias
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_PROXY_TARGET=http://localhost:8000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Desarrollo

### Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción de producción
npm run preview

# Ejecutar linter
npm run lint

# Limpiar caché de Vite
npm run clean

# Limpiar caché e iniciar desarrollo
npm run fresh
```

### Estructura de un Feature

Cada feature sigue una estructura consistente:

```
feature-name/
├── components/        # Componentes específicos del feature
├── modules/          # Submódulos funcionales
├── pages/            # Páginas principales
├── routes/           # Router del feature
├── services/         # Servicios API
├── hooks/            # Hooks personalizados
├── store/            # Estado local (Zustand)
├── styles/           # Estilos específicos
└── index.jsx         # Punto de entrada del feature
```

### Convenciones de Código

- **Nomenclatura**: PascalCase para componentes, camelCase para funciones y variables
- **Archivos**: Un componente por archivo, mismo nombre que el componente
- **Estilos**: CSS Modules para estilos con scope local
- **Imports**: Usar alias `@features`, `@shared`, `@app` para imports absolutos
- **Componentes**: Funcionales con hooks, evitar clases cuando sea posible

## Estructura de Carpetas

### src/app

Configuración central de la aplicación, incluyendo el router principal, guards de autenticación, middleware y validadores.

### src/features

Cada feature es un módulo independiente que contiene:

- **components/**: Componentes UI específicos del módulo
- **modules/**: Submódulos que agrupan funcionalidades relacionadas
- **pages/**: Páginas principales del módulo
- **routes/**: Definición de rutas internas del módulo
- **services/**: Llamadas a APIs y lógica de comunicación con backend
- **hooks/**: Hooks personalizados para lógica reutilizable
- **store/**: Estado local del módulo usando Zustand
- **styles/**: Estilos específicos del módulo

### src/shared

Recursos compartidos entre todos los módulos:

- **components/**: Componentes UI reutilizables (Button, Input, Modal, Table, etc.)
- **context/**: Contextos globales (UserProfile, ChatPanel)
- **services/**: Servicios compartidos (API client base)
- **utils/**: Funciones utilitarias
- **types/**: Definiciones de tipos TypeScript
- **guards/**: Guards de rutas reutilizables
- **validators/**: Validadores de formularios

### Componentes Compartidos Principales

- **Layout**: Sidebar, Header, Footer, MainLayout
- **Form**: Input, Select, Textarea, DatePicker, FormField
- **Feedback**: Toast, Modal, ConfirmModal, EmptyState
- **Data Display**: Table, Card, Badge, Tag
- **Navigation**: Breadcrumb, Tabs, Pagination
- **Charts**: Componentes de visualización con Recharts
- **ChatPanel**: Panel de chat integrado con IA

## Autenticación

El sistema implementa múltiples métodos de autenticación:

- Autenticación tradicional con email y contraseña
- OAuth 2.0 con Google
- OAuth 2.0 con Microsoft (Azure AD)
- Gestión de sesiones con tokens JWT
- Refresh tokens para renovación automática
- Guards de rutas basados en roles

## Estado Global

La aplicación utiliza una combinación de:

- **React Context**: Para datos de usuario, perfil y panel de chat
- **Zustand**: Para estado de módulos específicos
- **LocalStorage**: Para persistencia de preferencias y datos de sesión
- **Cookies**: Para tokens de autenticación

## Estilos

- **Tailwind CSS**: Utilidades para diseño rápido
- **CSS Modules**: Para estilos con scope local
- **CSS Global**: En `index.css` para estilos base y scrollbar personalizado
- **Tema**: Configuración centralizada con Ant Design ConfigProvider

## Despliegue

El proyecto está configurado para despliegue en Vercel con:

- Build automático desde el repositorio
- Variables de entorno configuradas
- Proxy para API en desarrollo
- Optimización de assets con Vite

## Contribución

Este es un proyecto privado desarrollado para RpSoft. Para contribuciones, contactar al equipo de desarrollo.

## Licencia

Proyecto privado - Todos los derechos reservados
