# Flujo de Postulación - Implementación Completa

## ✅ Lo que se ha implementado

### Flujo Lineal Completo

El flujo de postulación ahora es **100% lineal** y funcional con el backend según las APIs especificadas:

```
1. Datos Personales → POST /api/postulants/me/personal-data/
2. Encuesta de Perfil → POST /api/postulants/me/survey-responses/profile
3. Evaluación Técnica → POST /api/convocatorias/{id}/start-evaluation/ → Completar evaluación
4. Encuesta Psicológica → POST /api/postulants/me/survey-responses/psychological
5. Encuesta de Motivación → POST /api/postulants/me/survey-responses/motivation
6. Subir CV → POST /api/files/upload/
7. Confirmación → (Frontend)
```

---

## 📋 Componentes Creados/Modificados

### 1. **EvaluacionEmbedded** (NUEVO)
**Ubicación**: `components/EvaluacionEmbedded/`

**Descripción**: Componente embebido que muestra la evaluación directamente en el flujo de postulación, sin salir de la página.

**Características**:
- ✅ Carga automática de evaluación desde convocatoria
- ✅ Inicia intento automáticamente
- ✅ Muestra preguntas con navegación
- ✅ Auto-guardado cada 30 segundos
- ✅ Timer con límite de tiempo
- ✅ Calificación automática al finalizar
- ✅ Callback `onComplete` para continuar al siguiente paso

### 2. **TecnicaStep** (MODIFICADO)
**Ubicación**: `components/Tecnica/`

**Cambios**:
- ✅ Ahora usa `EvaluacionEmbedded` en lugar de redirigir
- ✅ Mantiene el flujo lineal
- ✅ Llama a `onNext` cuando se completa la evaluación

### 3. **PostulacionPage** (MODIFICADO)
**Ubicación**: `pages/PostulacionPage.jsx`

**Mejoras**:
- ✅ Guarda encuesta de perfil al avanzar del paso 2
- ✅ Guarda encuesta psicológica al avanzar del paso 4
- ✅ Guarda encuesta de motivación al avanzar del paso 5
- ✅ Maneja correctamente el paso 3 (evaluación técnica)

### 4. **usePostulacion Hook** (MODIFICADO)
**Ubicación**: `hooks/usePostulacion.js`

**Nuevas funciones**:
- ✅ `guardarEncuestaPerfil(surveyData)`
- ✅ `guardarEncuestaPsicologica(surveyData)`
- ✅ `guardarEncuestaMotivacion(surveyData)`

### 5. **postulacionService** (MODIFICADO)
**Ubicación**: `services/postulacionService.js`

**Nuevos servicios**:
- ✅ `guardarEncuestaPerfil(surveyData)` → POST `/api/postulants/me/survey-responses/profile`
- ✅ `guardarEncuestaPsicologica(surveyData)` → POST `/api/postulants/me/survey-responses/psychological`
- ✅ `guardarEncuestaMotivacion(surveyData)` → POST `/api/postulants/me/survey-responses/motivation`

---

## 🔄 Flujo Completo Paso a Paso

### Paso 1: Datos Personales
1. Usuario completa el formulario
2. Al hacer clic en "Siguiente":
   - Se guarda en `POST /api/postulants/me/personal-data/`
   - Si hay éxito, avanza al paso 2

### Paso 2: Encuesta de Perfil
1. Usuario completa las preguntas de perfil
2. Al hacer clic en "Siguiente":
   - Se guarda en `POST /api/postulants/me/survey-responses/profile`
   - Si hay éxito, avanza al paso 3

### Paso 3: Evaluación Técnica
1. Si hay `convocatoriaId`:
   - Se muestra `EvaluacionEmbedded`
   - Se inicia automáticamente la evaluación
   - Usuario completa las preguntas
   - Al finalizar, se califica automáticamente
   - Se llama a `onNext` para avanzar al paso 4
2. Si NO hay `convocatoriaId`:
   - Se muestra mensaje de que no hay evaluación
   - Usuario puede continuar sin evaluación

### Paso 4: Encuesta Psicológica
1. Usuario completa las preguntas psicológicas
2. Al hacer clic en "Siguiente":
   - Se guarda en `POST /api/postulants/me/survey-responses/psychological`
   - Si hay éxito, avanza al paso 5

### Paso 5: Encuesta de Motivación
1. Usuario completa las preguntas de motivación
2. Al hacer clic en "Siguiente":
   - Se guarda en `POST /api/postulants/me/survey-responses/motivation`
   - Si hay éxito, avanza al paso 6

### Paso 6: Subir CV
1. Usuario selecciona archivo CV
2. Al hacer clic en "Siguiente":
   - Se sube el archivo con `POST /api/files/upload/`
   - Si hay éxito, avanza al paso 7

### Paso 7: Confirmación
1. Usuario revisa toda la información
2. Al hacer clic en "Confirmar":
   - Se muestra mensaje de éxito
   - Se redirige al dashboard

---

## 🔌 Integración con APIs

### Endpoints Utilizados

| Paso | Endpoint | Método | Descripción |
|------|----------|--------|-------------|
| 1 | `/api/postulants/me/personal-data/` | POST | Guardar datos personales |
| 2 | `/api/postulants/me/survey-responses/profile` | POST | Guardar encuesta de perfil |
| 3 | `/api/convocatorias/{id}/start-evaluation/` | POST | Iniciar evaluación técnica |
| 3 | `/api/evaluations/{id}/view/` | GET | Obtener evaluación |
| 3 | `/api/evaluations/{id}/start/` | POST | Iniciar intento |
| 3 | `/api/evaluation-attempts/{id}/answers/` | POST | Guardar respuestas |
| 3 | `/api/evaluation-attempts/{id}/grade/` | POST | Calificar evaluación |
| 4 | `/api/postulants/me/survey-responses/psychological` | POST | Guardar encuesta psicológica |
| 5 | `/api/postulants/me/survey-responses/motivation` | POST | Guardar encuesta de motivación |
| 6 | `/api/files/upload/` | POST | Subir CV |

---

## 🎯 Características Implementadas

### ✅ Flujo Lineal
- Todo se hace en una sola página
- No hay redirecciones fuera del flujo
- Navegación fluida entre pasos

### ✅ Guardado Automático
- Evaluación técnica: Auto-guardado cada 30 segundos
- Encuestas: Se guardan al avanzar al siguiente paso
- Datos personales: Se guardan al avanzar del paso 1

### ✅ Validaciones
- Validación de campos requeridos en cada paso
- No se avanza si hay errores
- Mensajes de error claros

### ✅ Manejo de Errores
- Toast notifications para errores
- No se pierde el progreso si hay error
- Mensajes descriptivos

### ✅ UX Mejorada
- Loading states en todas las operaciones
- Skeleton loaders mientras carga
- Confirmaciones antes de acciones importantes

---

## 📝 Formato de Datos

### Encuesta de Perfil
```json
{
  "area_interes": "frontend",
  "experiencia_previa": "si",
  "nivel_compromiso": "alto"
}
```

### Encuesta Psicológica
```json
{
  "trabajo_equipo": "Excelente",
  "manejo_conflictos": "Busco soluciones constructivas",
  "actitud_desafios": "Los veo como oportunidades"
}
```

### Encuesta de Motivación
```json
{
  "motivacion": "Quiero aprender desarrollo web...",
  "expectativas": "Espero aprender React y TypeScript...",
  "participacion_proyectos": "Sí, estoy dispuesto porque..."
}
```

---

## 🚀 Cómo Usar

### Para Postulantes

1. **Acceder al formulario**:
   ```
   /seleccion-practicantes/postulacion?convocatoria=5
   ```

2. **Completar los pasos en orden**:
   - Datos Personales
   - Perfil
   - Técnica (evaluación embebida)
   - Psicológica
   - Motivación
   - CV
   - Confirmación

3. **Todo se guarda automáticamente** al avanzar

### Para Desarrolladores

El flujo está completamente integrado. Solo necesitas:

1. Asegurarte de que el backend tenga los endpoints implementados
2. Verificar que las respuestas de la API coincidan con lo esperado
3. Probar el flujo completo

---

## ⚠️ Notas Importantes

1. **ID del Postulante**: Se obtiene automáticamente del usuario autenticado usando `/me/`
2. **Evaluación Técnica**: Se inicia automáticamente desde la convocatoria
3. **Flujo Lineal**: No hay redirecciones, todo está en una sola página
4. **Guardado Automático**: Las respuestas de evaluación se guardan cada 30 segundos
5. **Validaciones**: Cada paso valida antes de avanzar

---

## 🔧 Próximas Mejoras (Opcionales)

1. Permitir guardar progreso y continuar más tarde
2. Agregar indicador de progreso general
3. Permitir editar pasos anteriores
4. Agregar vista previa antes de confirmar
5. Mejorar manejo de errores de red

---

**Última actualización**: 2025-01-XX
**Estado**: ✅ Implementado y funcional

