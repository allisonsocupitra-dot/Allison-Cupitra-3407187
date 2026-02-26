
# 🏢 PropFund — Plataforma de Crowdfunding Inmobiliario

**Proyecto Semana 02 — Gestor de Colección**
**Dominio asignado:** Crowdfunding Inmobiliario

---

## ¿De qué trata mi dominio?

Mi dominio es una plataforma de **crowdfunding inmobiliario**, es decir, una aplicación donde múltiples inversores pueden aportar capital para financiar proyectos de construcción o compra de inmuebles. Cada proyecto tiene una meta de financiación, un monto ya recaudado, un nivel de riesgo y una fecha límite para cerrar la ronda de inversión.

Este tipo de plataformas existen en el mundo real (como Fundrise o Briq en Colombia) y permiten que personas con poco capital puedan invertir en bienes raíces de forma colectiva.

---

## Estructura de archivos

```
week-2/
└── solution/
    └── scripts.js      → Lógica JavaScript (solucion)    
└── starte/
    ├── index.html       → Estructura HTML de la aplicación
    ├── styles.css       → Estilos visuales
    └── scripts.js      → Lógica JavaScript (problema)
```

---

## Adaptaciones realizadas al dominio

### 1. Entidad principal: Proyecto Inmobiliario

En la plantilla genérica la entidad se llamaba "Elemento". Yo la reemplacé por **Proyecto**, que representa un inmueble o desarrollo en busca de financiación colectiva.

Cada proyecto tiene estas propiedades específicas de mi dominio:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `name` | String | Nombre del proyecto (ej. "Torres Parque Central") |
| `description` | String | Ubicación, características del inmueble |
| `category` | String | Tipo de inmueble (residencial, comercial, etc.) |
| `priority` | String | Nivel de riesgo de la inversión (bajo/medio/alto) |
| `meta` | Number | Meta de financiación en dólares USD |
| `recaudado` | Number | Capital recaudado hasta el momento |
| `tir` | String | Fecha límite de financiación |
| `active` | Boolean | Si el proyecto está activo o inactivo |

---

### 2. Categorías de mi dominio (`CATEGORIES`)

Reemplacé las categorías genéricas por los **tipos de inmueble** más comunes en el mercado inmobiliario:

```javascript
const CATEGORIES = {
  residential: { name: 'Residencial', emoji: '🏠' },
  commercial:  { name: 'Comercial',   emoji: '🏢' },
  land:        { name: 'Lote / Tierra', emoji: '🌿' },
  industrial:  { name: 'Industrial',  emoji: '🏭' },
  mixed:       { name: 'Uso Mixto',   emoji: '🏙️' },
  other:       { name: 'Otro',        emoji: '📌' },
};
```

Estas categorías aparecen en el formulario de creación, en los filtros y en las tarjetas de cada proyecto.

---

### 3. Niveles de riesgo (antes "Prioridad")

El campo `priority` de la plantilla lo usé para representar el **nivel de riesgo** de la inversión, que es un concepto clave en finanzas inmobiliarias:

```javascript
const PRIORITIES = {
  high:   { name: 'Alto',  color: '#ef4444' },  // 🔴 Rojo - riesgo alto
  medium: { name: 'Medio', color: '#f59e0b' },  // 🟡 Amarillo - riesgo medio
  low:    { name: 'Bajo',  color: '#22c55e' },  // 🟢 Verde - riesgo bajo
};
```

El color del borde izquierdo de cada tarjeta cambia según el nivel de riesgo, dando una señal visual inmediata al inversor.

---

### 4. Barra de progreso de financiación

Esta fue la adición más importante del dominio. Cada proyecto muestra una **barra de progreso** que indica cuánto se ha recaudado respecto a la meta:

```javascript
const porcentaje = meta
  ? Math.min(100, Math.round((recaudado / meta) * 100))
  : 0;
```

La barra usa un degradado de azul a verde y se renderiza en la tarjeta de cada proyecto. Esto es esencial en crowdfunding porque el inversor necesita ver de un vistazo cuánto falta para cerrar la ronda.

---

### 5. Función `formatMoney()`

Agregué una función auxiliar para mostrar los montos en dólares con formato legible:

```javascript
const formatMoney = number => {
  if (!number && number !== 0) return '—';
  return '$' + Number(number).toLocaleString('en-US');
};
```

Ejemplo: `500000` → `$500,000`

---

### 6. Estadísticas específicas del dominio

En `getStats()` agregué cálculos financieros relevantes para una cartera de inversión:

```javascript
// Capital total recaudado entre todos los proyectos
const totalRecaudado = itemsToAnalyze.reduce((acc, item) => {
  return acc + (Number(item.recaudado) || 0);
}, 0);

// Suma de todas las metas de financiación
const totalMeta = itemsToAnalyze.reduce((acc, item) => {
  return acc + (Number(item.meta) || 0);
}, 0);
```

Estos números se muestran en la sección de **Estadísticas de la Cartera** al final de la página.

---

### 7. LocalStorage con key de dominio

Los datos se persisten en el navegador usando una clave específica del dominio para no mezclarlos con otros proyectos del curso:

```javascript
localStorage.getItem('propfundProjects')
localStorage.setItem('propfundProjects', JSON.stringify(itemsToSave))
```

---

### 8. Diseño visual (`styles.css`)

El diseño imita el de una plataforma financiera real:

- **Fondo:** Azul oscuro `#1e2a4a` que da sensación de seriedad y confianza
- **Cards:** Fondo blanco `#ffffff` con sombras suaves para destacar sobre el fondo
- **Color primario:** Índigo `#4f46e5` — profesional y moderno
- **Borde lateral de tarjetas:** Cambia de color según el nivel de riesgo del proyecto
- **Barra de progreso:** Degradado azul→verde para mostrar el avance de financiación

---

## Características ES2023 utilizadas

| Característica | Dónde la usé |
|----------------|-------------|
| **Spread operator** `...` | `createItem()` para copiar objetos sin mutarlos, `applyFilters()` para encadenar resultados |
| **Rest / Default parameters** | `getStats(itemsToAnalyze = [])`, `applyFilters(filters = {})` |
| **`Array.map()`** | `updateItem()`, `toggleItemActive()`, `renderItems()` |
| **`Array.filter()`** | `deleteItem()`, `clearInactive()`, todos los filtros |
| **`Array.reduce()`** | `getStats()` para calcular totales por categoría, riesgo y montos |
| **`Array.find()`** | `handleItemEdit()` para buscar el proyecto a editar |
| **Destructuring** | `applyFilters()` para extraer filtros, `renderItem()` para extraer propiedades |
| **Template literals** | Todo el HTML dinámico en `renderItem()` y `renderStats()` |
| **Operador `??`** | `loadItems()`, valores por defecto en `createItem()` |
| **Optional chaining `?.`** | `CATEGORIES[category]?.name`, `CATEGORIES[category]?.emoji` |

---

## Inmutabilidad del estado

Nunca muto el array `items` directamente. Siempre creo arrays nuevos:

```javascript
// ✅ Correcto - creo un array nuevo
const newItems = [...items, newItem];

// ✅ Correcto - map devuelve un array nuevo
const updatedItems = items.map(item => item.id === id ? { ...item, ...updates } : item);

// ❌ Nunca hago esto
items.push(newItem);
items[0].name = 'otro nombre';
```

---

## Cómo conectar los archivos

En el `index.html`, la última línea antes de `</body>` debe apuntar al archivo JavaScript:

```html

```

> ⚠️ Verificar que la ruta coincida con la ubicación real del archivo dentro de la carpeta del proyecto.

---

## Checklist de entrega

- [x] Categorías adaptadas al dominio inmobiliario
- [x] Campos adicionales: meta, recaudado, fecha límite
- [x] CRUD completo: crear, leer, actualizar, eliminar
- [x] Toggle activo / inactivo por proyecto
- [x] Filtros por estado, tipo de inmueble y nivel de riesgo
- [x] Búsqueda en tiempo real por nombre y descripción
- [x] Estadísticas de cartera con totales financieros
- [x] Barra de progreso de financiación por proyecto
- [x] Persistencia con localStorage
- [x] Inmutabilidad del estado en todo el código
- [x] Comentarios en español, nomenclatura técnica en inglés
- [x] Uso de: spread, map, filter, reduce, find, destructuring, template literals