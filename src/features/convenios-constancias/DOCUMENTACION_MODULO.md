# 📚 DOCUMENTACIÓN COMPLETA DEL MÓDULO CONVENIOS Y CONSTANCIAS

> **Última actualización:** 7 de Noviembre, 2025  
> **Ubicación:** `src/features/convenios-constancias/`

---

## 📑 TABLA DE CONTENIDOS

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Punto de Entrada](#punto-de-entrada)
4. [Sistema de Rutas](#sistema-de-rutas)
5. [Componentes](#componentes)
6. [Páginas](#páginas)
7. [Estilos CSS](#estilos-css)
8. [Integración con la App](#integración-con-la-app)
9. [Flujo de Datos](#flujo-de-datos)

---

## 🎯 VISIÓN GENERAL

### ¿Qué es este módulo?
Módulo independiente para gestionar convenios y constancias con:
- Dashboard con métricas
- Revisión de documentos
- Auditoría de procesos
- Configuración del módulo

### Tecnologías
- **React 19.1.1** - UI Library
- **React Router DOM 7.9.5** - Routing
- **Tailwind CSS 4.1.16** - Styling
- **Lucide React 0.552.0** - Icons
- **Clsx 2.1.1** - CSS utilities

---

## 🏗️ ARQUITECTURA

### Estructura de Directorios

```
convenios-constancias/
├── index.jsx                    # 🚪 Punto de entrada
├── components/                  # 🧩 Componentes reutilizables
│   ├── Layout/
│   │   ├── Layout.jsx          # Layout principal
│   │   └── index.js
│   └── Sidebar/
│       ├── Sidebar.jsx         # Navegación del módulo
│       ├── Sidebar.module.css
│       ├── SidebarBackButton.jsx
│       ├── SidebarBackButton.module.css
│       └── index.js
├── pages/                       # 📄 Vistas
│   ├── Dashboard.jsx
│   ├── Auditoria.jsx
│   ├── Configuracion.jsx
│   ├── RevisionDocumentos.jsx
│   └── index.js
├── routes/                      # 🛣️ Configuración de rutas
│   ├── router.jsx
│   └── index.js
├── hooks/                       # (vacío)
├── services/                    # (vacío)
├── store/                       # (vacío)
└── modules/                     # (vacío)
```

---

## 🚪 PUNTO DE ENTRADA

### `index.jsx`

**Ubicación:** `src/features/convenios-constancias/index.jsx`

```jsx
import { ModuleRouter } from './routes'

export function ConveniosConstanciasIndex() {
  return <ModuleRouter />
}
```

#### ¿Qué hace?
- Exporta el componente principal del módulo
- Renderiza el router con todas las rutas internas
- Es el único punto de entrada desde el exterior

#### ¿De dónde jala información?
- **Importa:** `./routes/index.js` → `./routes/router.jsx`
- **Es usado por:** `src/app/routes/router.jsx` (lazy import)

#### Flujo de carga
```
App Router
  ↓ lazy()
ConveniosConstanciasIndex
  ↓
ModuleRouter
  ↓
Layout + Páginas
```

---

## 🛣️ SISTEMA DE RUTAS

### `routes/router.jsx`

**Ubicación:** `src/features/convenios-constancias/routes/router.jsx`

```jsx
import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../pages/Dashboard'
import Auditoria from '../pages/Auditoria'
import Configuracion from '../pages/Configuracion'
import RevisionDocumentos from '../pages/RevisionDocumentos'

export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="revision-documentos" element={<RevisionDocumentos />} />
        <Route path="auditoria" element={<Auditoria />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  )
}
```

#### ¿Qué hace?
Define todas las rutas del módulo con un Layout compartido

#### Tabla de Rutas

| URL | Componente | Descripción |
|-----|-----------|-------------|
| `/convenios-constancias` | Dashboard | Vista principal |
| `/convenios-constancias/revision-documentos` | RevisionDocumentos | Revisión docs |
| `/convenios-constancias/auditoria` | Auditoria | Auditoría |
| `/convenios-constancias/configuracion` | Configuracion | Config |

#### ¿De dónde jala información?

**Importaciones internas:**
- `../components/Layout` → Layout.jsx
- `../pages/*` → Todas las páginas

**Importaciones externas:**
- `react-router-dom` → Routes, Route

#### Patrón de rutas anidadas
```
<Routes>
  └── <Route element={<Layout />}>    ← Wrapper (siempre visible)
      ├── index → Dashboard
      ├── revision-documentos
      ├── auditoria
      └── configuracion
```

---

## 🧩 COMPONENTES

### 1. Layout

**Ubicación:** `src/features/convenios-constancias/components/Layout/Layout.jsx`

```jsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { Header } from '@shared/components/Layout/Header'

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

#### ¿Qué hace?
- Crea la estructura visual del módulo
- Divide pantalla: Sidebar (izq) + Contenido (der)
- Renderiza Header + área de contenido scrolleable

#### ¿De dónde jala información?

**Importaciones internas:**
- `../Sidebar` → Sidebar.jsx del módulo

**Importaciones compartidas:**
- `@shared/components/Layout/Header` → Header global de la app

**Importaciones externas:**
- `react-router-dom` → Outlet (renderiza rutas hijas)

#### Estructura visual
```
┌────────────────────────────────┐
│ ┌────────┬──────────────────┐  │
│ │        │   Header         │  │
│ │ Side   ├──────────────────┤  │
│ │ bar    │   <Outlet />     │  │
│ │        │   (Página)       │  │
│ └────────┴──────────────────┘  │
└────────────────────────────────┘
```

---

### 2. Sidebar

**Ubicación:** `src/features/convenios-constancias/components/Sidebar/Sidebar.jsx`

```jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Eye, Shield, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'
import { SidebarHeader } from '@shared/components/Layout/Sidebar/SidebarHeader/index.js'
import { SidebarFooter } from '@shared/components/Layout/Sidebar/SidebarFooter/index.js'
import { SidebarBackButton } from './SidebarBackButton'

const menuItems = [
  {
    title: 'CONVENIOS Y CONSTANCIAS',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/convenios-constancias' },
      { icon: Eye, label: 'Revision de Documentos', path: '/convenios-constancias/revision-documentos' },
      { icon: Shield, label: 'Auditoria', path: '/convenios-constancias/auditoria' },
      { icon: Settings, label: 'Configuracion', path: '/convenios-constancias/configuracion' },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    'CONVENIOS Y CONSTANCIAS': true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const isActive = (path) => {
    if (path === '/convenios-constancias') {
      return location.pathname === '/convenios-constancias' || location.pathname === '/convenios-constancias/'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <SidebarBackButton />
      <nav className={styles.nav}>
        {menuItems.map((section) => (
          <div key={section.title} className={styles.section}>
            <button onClick={() => toggleSection(section.title)} className={styles.sectionButton}>
              <span>{section.title}</span>
              {expandedSections[section.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedSections[section.title] && (
              <div className={styles.sectionItems}>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={clsx(styles.menuItem, active && styles.active)}
                    >
                      <Icon size={20} className={styles.menuIcon} />
                      <span className={styles.menuLabel}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      <SidebarFooter />
    </div>
  )
}
```

#### ¿Qué hace?

**Funcionalidades:**
1. Muestra menú de navegación del módulo
2. Permite expandir/colapsar secciones
3. Resalta opción activa según URL
4. Navega entre páginas al hacer clic

**Estado:**
```jsx
const [expandedSections, setExpandedSections] = useState({
  'CONVENIOS Y CONSTANCIAS': true  // Expandido por defecto
})
```

**Hooks:**
- `useLocation()` - Obtiene URL actual
- `useNavigate()` - Navega programáticamente
- `useState()` - Maneja expansión de secciones

**Funciones clave:**

`toggleSection(title)` - Expande/colapsa sección
`isActive(path)` - Determina si ruta está activa

**Iconos (Lucide React):**
- LayoutDashboard - Dashboard
- Eye - Revisión
- Shield - Auditoría
- Settings - Configuración
- ChevronDown/Right - Indicadores

#### ¿De dónde jala información?

**Datos estáticos:**
- `menuItems` - Array con opciones del menú (hardcoded)

**Importaciones internas:**
- `./Sidebar.module.css` - Estilos
- `./SidebarBackButton` - Botón retorno

**Importaciones compartidas:**
- `@shared/components/Layout/Sidebar/SidebarHeader`
- `@shared/components/Layout/Sidebar/SidebarFooter`

**Importaciones externas:**
- `react` - useState
- `react-router-dom` - useLocation, useNavigate
- `lucide-react` - Iconos
- `clsx` - Utilidad CSS

#### Flujo de navegación
```
Click en opción
  ↓
navigate(path)
  ↓
URL cambia
  ↓
useLocation() detecta cambio
  ↓
isActive() actualiza visual
  ↓
Opción se resalta
```

---

### 3. SidebarBackButton

**Ubicación:** `src/features/convenios-constancias/components/Sidebar/SidebarBackButton.jsx`

```jsx
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './SidebarBackButton.module.css'

export function SidebarBackButton() {
  const navigate = useNavigate()

  const handleBackToMain = () => {
    navigate('/')
  }

  return (
    <div className={styles.backButtonContainer}>
      <button onClick={handleBackToMain} className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Volver al menú general</span>
      </button>
    </div>
  )
}
```

#### ¿Qué hace?
- Botón para volver al dashboard principal
- Navega a `/` al hacer clic

#### ¿De dónde jala información?
- `react-router-dom` - useNavigate
- `lucide-react` - ArrowLeft icon
- `./SidebarBackButton.module.css` - Estilos

---

## 📄 PÁGINAS

### 1. Dashboard

**Ubicación:** `src/features/convenios-constancias/pages/Dashboard.jsx`

```jsx
export function Dashboard() {
  return (
    <div className="ml-8 px-12 py-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Convenios y Constancias</h1>
      <p className="text-gray-600">Bienvenido al módulo de Convenios y Constancias</p>
    </div>
  )
}
```

#### ¿Qué hace?
Vista principal con título y mensaje de bienvenida

#### ¿De dónde jala información?
**Actualmente:** Contenido estático (hardcoded)

**Futuro:** Podría conectarse a:
- API para métricas
- Store global para datos
- Servicios para estadísticas

---

### 2. Auditoria

**Ubicación:** `src/features/convenios-constancias/pages/Auditoria.jsx`

```jsx
export default function HolaMundo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">¡Hola Mundo!</h1>
    </div>
  );
}
```

#### Estado
⚠️ **Componente temporal** - Placeholder que será reemplazado

#### Implementación futura
- Logs de auditoría
- Filtros de búsqueda
- Tabla de eventos
- Detalles de cambios

---

### 3. Configuracion

**Ubicación:** `src/features/convenios-constancias/pages/Configuracion.jsx`

```jsx
export default function HolaMundo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">¡Hola Mundo!</h1>
    </div>
  );
}
```

#### Estado
⚠️ **Componente temporal** - Placeholder

#### Implementación futura
- Configuraciones del módulo
- Permisos de usuario
- Preferencias
- Ajustes de notificaciones

---

### 4. RevisionDocumentos

**Ubicación:** `src/features/convenios-constancias/pages/RevisionDocumentos.jsx`

```jsx
export default function HolaMundo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">¡Hola Mundo!</h1>
    </div>
  );
}
```

#### Estado
⚠️ **Componente temporal** - Placeholder

#### Implementación futura
- Lista de documentos pendientes
- Visor de documentos
- Botones aprobación/rechazo
- Comentarios
- Historial de revisiones

---

### pages/index.js

**Ubicación:** `src/features/convenios-constancias/pages/index.js`

```jsx
export { Dashboard } from './Dashboard'
export { default as Auditoria } from './Auditoria'
export { default as Configuracion } from './Configuracion'
export { default as RevisionDocumentos } from './RevisionDocumentos'
```

#### ¿Qué hace?
**Barrel Export Pattern** - Centraliza exportaciones

#### Ventaja
```jsx
// Sin barrel:
import { Dashboard } from './pages/Dashboard'
import Auditoria from './pages/Auditoria'

// Con barrel:
import { Dashboard, Auditoria } from './pages'  // ✅ Más limpio
```

---

## 🎨 ESTILOS CSS

### Sidebar.module.css

**Ubicación:** `src/features/convenios-constancias/components/Sidebar/Sidebar.module.css`

#### Clases principales

**`.sidebar`**
```css
width: 256px;
min-width: 256px;
max-width: 256px;
height: 100vh;
background-color: white;
border-right: 1px solid #e5e7eb;
```
- Ancho fijo de 256px
- Altura completa de viewport
- Fondo blanco con borde derecho

**`.nav`**
```css
flex: 1;
overflow-y: auto;
padding: 1rem 0;
```
- Área scrolleable del menú

**`.menuItem`**
```css
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.625rem 1rem;
border-radius: 0.5rem;
transition: all 0.2s;
```
- Botón de opción del menú
- Flexbox con gap entre icono y texto

**`.menuItem.active`**
```css
background-color: black;
color: white;
```
- Estilo para opción activa
- Fondo negro, texto blanco

**`.menuItem:not(.active):hover`**
```css
background-color: #f3f4f6;
```
- Hover en opciones inactivas

#### ¿De dónde jala información?
- Estilos definidos localmente en el archivo
- Usa CSS Modules (scope local)
- Importado por `Sidebar.jsx`

---

### SidebarBackButton.module.css

**Ubicación:** `src/features/convenios-constancias/components/Sidebar/SidebarBackButton.module.css`

#### Clases principales

**`.backButtonContainer`**
```css
padding: 0.75rem 1rem;
border-bottom: 1px solid #e5e7eb;
```
- Contenedor del botón con borde inferior

**`.backButton`**
```css
display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.5rem;
color: #6b7280;
font-size: 0.75rem;
transition: color 0.2s;
```
- Botón con icono y texto
- Color gris por defecto

**`.backButton:hover`**
```css
color: #374151;
background-color: #f3f4f6;
```
- Hover más oscuro con fondo

---

### CSS Global

**Ubicación:** `src/index.css`

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Be Vietnam Pro', sans-serif;
}
```

#### ¿Qué hace?
- Importa Tailwind CSS
- Reset CSS global
- Define fuente global: **Be Vietnam Pro**

#### ¿De dónde jala información?
- `tailwindcss` - Paquete npm
- Fuente Google Fonts (cargada en HTML)

---

## 🔗 INTEGRACIÓN CON LA APP

### 1. Router Principal

**Ubicación:** `src/app/routes/router.jsx`

```jsx
const ConveniosConstanciasIndex = lazy(() =>
  import('@features/convenios-constancias').then((m) => ({ 
    default: m.ConveniosConstanciasIndex 
  }))
)

// ...

<Route
  path="/convenios-constancias/*"
  element={
    <Suspense fallback={null}>
      <ConveniosConstanciasIndex />
    </Suspense>
  }
/>
```

#### ¿Qué hace?
- **Lazy loading** del módulo completo
- Ruta base: `/convenios-constancias/*`
- `*` permite rutas anidadas dentro del módulo

#### ¿De dónde jala información?
- `@features/convenios-constancias` - Alias configurado
- Apunta a: `src/features/convenios-constancias/index.jsx`

---

### 2. MainLayout

**Ubicación:** `src/shared/components/Layout/MainLayout.jsx`

```jsx
const isModuleRoute = location.pathname !== '/' && 
  !location.pathname.startsWith('/configuracion') &&
  (location.pathname.startsWith('/seleccion-practicantes') ||
   // ...
   location.pathname.startsWith('/convenios-constancias'))
```

#### ¿Qué hace?
- Detecta si estamos en una ruta de módulo
- Si es módulo: no renderiza Layout principal
- El módulo usa su propio Layout

---

### 3. Sidebar Principal

**Ubicación:** `src/shared/components/Layout/Sidebar/Sidebar.jsx`

```jsx
{
  icon: FileCheck,
  label: 'Convenios Constancias',
  path: '/convenios-constancias',
}
```

#### ¿Qué hace?
- Opción en el menú principal
- Navega al módulo al hacer clic

---

## 🔄 FLUJO DE DATOS

### Flujo de Navegación Completo

```
1. Usuario en Dashboard Principal
   ↓
2. Click en "Convenios Constancias" (Sidebar principal)
   ↓
3. Router principal carga módulo (lazy)
   ↓
4. ConveniosConstanciasIndex renderiza ModuleRouter
   ↓
5. ModuleRouter renderiza Layout del módulo
   ↓
6. Layout renderiza Sidebar + Header + Dashboard
   ↓
7. Usuario ve Dashboard del módulo
   ↓
8. Click en "Auditoría" (Sidebar del módulo)
   ↓
9. React Router cambia ruta a /convenios-constancias/auditoria
   ↓
10. ModuleRouter renderiza Auditoria en <Outlet />
    ↓
11. Layout se mantiene, solo cambia contenido
```

### Flujo de Carga de Módulo

```
App inicia
  ↓
Router principal carga
  ↓
Usuario navega a /convenios-constancias
  ↓
lazy() descarga módulo (code splitting)
  ↓
index.jsx se ejecuta
  ↓
ModuleRouter se monta
  ↓
Layout se renderiza
  ↓
Dashboard se muestra
```

### Flujo de Estilos

```
index.css (global)
  ↓ Reset + Tailwind + Fuente
Componentes usan Tailwind
  ↓ Clases utility
CSS Modules (Sidebar)
  ↓ Estilos locales
Resultado final renderizado
```

---

## 📦 DEPENDENCIAS

### Dependencias del Proyecto

**package.json:**
```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.552.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.5"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.16",
    "tailwindcss": "^4.1.16",
    "vite": "^7.1.7"
  }
}
```

### Uso en el Módulo

| Dependencia | Uso | Archivos |
|-------------|-----|----------|
| `react` | Componentes, hooks | Todos los .jsx |
| `react-router-dom` | Navegación, rutas | router.jsx, Sidebar.jsx, Layout.jsx |
| `lucide-react` | Iconos | Sidebar.jsx, SidebarBackButton.jsx |
| `clsx` | Clases CSS condicionales | Sidebar.jsx |
| `tailwindcss` | Estilos utility | Todos los componentes |

---

## 📁 CARPETAS VACÍAS

### hooks/
**Propósito futuro:** Custom React Hooks
- useConvenios()
- useDocumentos()
- useAuditoria()

### services/
**Propósito futuro:** Servicios API
- conveniosService.js
- documentosService.js
- auditoriaService.js

### store/
**Propósito futuro:** Estado global
- conveniosSlice.js
- documentosSlice.js
- Integración con Redux/Zustand

### modules/convenios/
**Propósito futuro:** Submódulo de convenios
- Estructura similar al módulo principal
- Funcionalidad específica de convenios

---

## 🎯 RESUMEN DE FLUJOS

### Flujo de Importación
```
App Router
  ↓ lazy import
index.jsx
  ↓ import
routes/router.jsx
  ↓ import
components/Layout/Layout.jsx
  ↓ import
components/Sidebar/Sidebar.jsx
  ↓ import
@shared components
```

### Flujo de Renderizado
```
<ConveniosConstanciasIndex>
  <ModuleRouter>
    <Routes>
      <Route element={<Layout />}>
        <Sidebar />
        <Header />
        <Outlet>
          <Dashboard /> o <Auditoria /> o ...
        </Outlet>
      </Route>
    </Routes>
  </ModuleRouter>
</ConveniosConstanciasIndex>
```

### Flujo de Datos (Futuro)
```
Usuario interactúa
  ↓
Componente dispara acción
  ↓
Hook llama servicio
  ↓
Servicio hace request API
  ↓
Respuesta actualiza store
  ↓
Store notifica componentes
  ↓
Componentes re-renderizan
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### ✅ Completado
- [x] Estructura de carpetas
- [x] Sistema de rutas
- [x] Layout y Sidebar
- [x] Navegación básica
- [x] Integración con app principal
- [x] Estilos CSS

### ⏳ Pendiente
- [ ] Implementar páginas reales (Auditoria, Configuracion, RevisionDocumentos)
- [ ] Crear servicios API
- [ ] Implementar hooks personalizados
- [ ] Configurar store/estado global
- [ ] Agregar tests
- [ ] Documentar API endpoints
- [ ] Implementar submódulos

---

## 📞 CONTACTO Y SOPORTE

Para más información sobre este módulo, consultar:
- Documentación de React Router: https://reactrouter.com
- Documentación de Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**Fin de la documentación**
