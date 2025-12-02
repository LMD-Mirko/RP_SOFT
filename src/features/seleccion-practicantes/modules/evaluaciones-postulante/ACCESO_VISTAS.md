# Cómo Acceder a las Vistas de Evaluaciones

## 📍 Rutas Disponibles

### 1. **Lista de Mis Evaluaciones**
**Ruta completa:** `/seleccion-practicantes/evaluaciones/mis-evaluaciones`

**Descripción:** Muestra todas las evaluaciones que has iniciado o completado.

**Acceso:**
- Directamente desde la URL del navegador
- Desde un enlace en el menú/sidebar (si lo agregas)
- Desde código: `navigate('/seleccion-practicantes/evaluaciones/mis-evaluaciones')`

**Ejemplo de URL:**
```
http://localhost:5173/seleccion-practicantes/evaluaciones/mis-evaluaciones
```

---

### 2. **Completar Evaluación**
**Ruta completa:** `/seleccion-practicantes/evaluaciones/:evaluationId/completar`

**Descripción:** Página para completar una evaluación técnica.

**Parámetros:**
- `evaluationId`: ID de la evaluación (UUID o número)

**Acceso:**
- **Automático desde el flujo de postulación:** Cuando estás en el paso "Técnica" del formulario de postulación y haces clic en "Iniciar Evaluación Técnica"
- **Desde "Mis Evaluaciones":** Si tienes un intento "En Progreso", puedes hacer clic en "Continuar"
- **Directamente desde URL:** Necesitas conocer el `evaluationId`

**Ejemplo de URL:**
```
http://localhost:5173/seleccion-practicantes/evaluaciones/550e8400-e29b-41d4-a716-446655440000/completar?convocatoria=5
```

**Query Parameters opcionales:**
- `convocatoria`: ID de la convocatoria (para mantener contexto)

---

### 3. **Ver Resultados de Evaluación**
**Ruta completa:** `/seleccion-practicantes/evaluaciones/:evaluationId/resultados`

**Descripción:** Muestra los resultados de una evaluación ya calificada.

**Parámetros:**
- `evaluationId`: ID de la evaluación (UUID o número)

**Acceso:**
- **Automático:** Después de completar y calificar una evaluación, redirige automáticamente aquí
- **Desde "Mis Evaluaciones":** Si tienes una evaluación "Calificada", puedes hacer clic en "Ver Resultados"
- **Directamente desde URL:** Necesitas conocer el `evaluationId`

**Ejemplo de URL:**
```
http://localhost:5173/seleccion-practicantes/evaluaciones/550e8400-e29b-41d4-a716-446655440000/resultados
```

---

## 🔄 Flujo Completo de Acceso

### Opción 1: Desde el Formulario de Postulación

1. **Inicia sesión** como postulante
2. Ve a **Postulación** (ruta: `/seleccion-practicantes/postulacion?convocatoria=5`)
3. Completa los pasos:
   - Datos Personales
   - Perfil
4. En el paso **"Técnica"**:
   - Haz clic en **"Iniciar Evaluación Técnica"**
   - Se redirige automáticamente a `/seleccion-practicantes/evaluaciones/{evaluationId}/completar`
5. Completa la evaluación
6. Al finalizar, se redirige automáticamente a `/seleccion-practicantes/evaluaciones/{evaluationId}/resultados`

### Opción 2: Desde "Mis Evaluaciones"

1. **Inicia sesión** como postulante
2. Ve a **Mis Evaluaciones**: `/seleccion-practicantes/evaluaciones/mis-evaluaciones`
3. Verás una tabla con todas tus evaluaciones
4. **Para continuar una evaluación:**
   - Busca una evaluación con estado "En Progreso"
   - Haz clic en el botón **"Continuar"**
5. **Para ver resultados:**
   - Busca una evaluación con estado "Calificado"
   - Haz clic en el botón **"Ver Resultados"**

---

## 🔗 Cómo Agregar Enlaces en el Menú/Sidebar

Si quieres agregar un enlace en el sidebar para acceder fácilmente a "Mis Evaluaciones", puedes agregarlo en el componente `Sidebar`:

```jsx
// En src/features/seleccion-practicantes/components/Sidebar/Sidebar.jsx
{
  label: 'Mis Evaluaciones',
  path: '/seleccion-practicantes/evaluaciones/mis-evaluaciones',
  icon: Award, // o el icono que prefieras
}
```

---

## 📝 Ejemplos de Código para Navegación

### Desde un Componente React

```jsx
import { useNavigate } from 'react-router-dom'

function MiComponente() {
  const navigate = useNavigate()
  
  // Ir a Mis Evaluaciones
  const verMisEvaluaciones = () => {
    navigate('/seleccion-practicantes/evaluaciones/mis-evaluaciones')
  }
  
  // Ir a completar evaluación
  const completarEvaluacion = (evaluationId) => {
    navigate(`/seleccion-practicantes/evaluaciones/${evaluationId}/completar`)
  }
  
  // Ir a ver resultados
  const verResultados = (evaluationId) => {
    navigate(`/seleccion-practicantes/evaluaciones/${evaluationId}/resultados`)
  }
  
  return (
    <button onClick={verMisEvaluaciones}>
      Ver Mis Evaluaciones
    </button>
  )
}
```

### Desde un Link de React Router

```jsx
import { Link } from 'react-router-dom'

<Link to="/seleccion-practicantes/evaluaciones/mis-evaluaciones">
  Ver Mis Evaluaciones
</Link>
```

---

## ⚠️ Requisitos de Acceso

- **Autenticación:** Todas las rutas requieren estar autenticado
- **Rol:** No hay restricción de rol específica (cualquier usuario autenticado puede acceder)
- **Evaluación ID:** Para las rutas de completar/resultados, necesitas el ID de la evaluación

---

## 🧪 Pruebas Rápidas

### 1. Probar "Mis Evaluaciones"
```
1. Inicia sesión
2. Ve a: http://localhost:5173/seleccion-practicantes/evaluaciones/mis-evaluaciones
3. Deberías ver la lista de tus evaluaciones (o un mensaje si no tienes ninguna)
```

### 2. Probar Completar Evaluación
```
1. Inicia sesión
2. Ve al formulario de postulación con una convocatoria
3. Llega al paso "Técnica"
4. Haz clic en "Iniciar Evaluación Técnica"
5. Deberías ser redirigido a la página de completar evaluación
```

### 3. Probar Ver Resultados
```
1. Completa una evaluación primero
2. O ve directamente a: 
   http://localhost:5173/seleccion-practicantes/evaluaciones/{evaluationId}/resultados
   (reemplaza {evaluationId} con un ID real)
```

---

## 🐛 Solución de Problemas

### Error 404 - Página no encontrada
- Verifica que estés autenticado
- Verifica que la ruta esté escrita correctamente
- Verifica que el `evaluationId` sea válido

### Error al iniciar evaluación
- Verifica que tengas datos personales completos (especialidad, nivel de experiencia)
- Verifica que exista una evaluación asignada para tu perfil
- Revisa la consola del navegador para ver el error específico

### No puedo ver mis evaluaciones
- Verifica que hayas iniciado al menos una evaluación
- Verifica que estés autenticado con la cuenta correcta
- Revisa los filtros en la página (puede que estés filtrando por un estado que no tienes)

---

## 📞 Notas Adicionales

- Las rutas están protegidas por autenticación (requieren login)
- El sistema automáticamente redirige después de completar una evaluación
- Puedes volver a "Mis Evaluaciones" desde cualquier página usando el botón "Volver"
- El sistema guarda automáticamente tus respuestas cada 30 segundos

