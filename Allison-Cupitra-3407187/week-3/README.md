# 🏢 Plataforma de Crowdfunding Inmobiliario  
### Implementación con Programación Orientada a Objetos (POO) en JavaScript

---

## 📌 Descripción del Proyecto

Esta aplicación web simula una **plataforma de crowdfunding inmobiliario**, donde los usuarios pueden registrar y visualizar proyectos de inversión inmobiliaria.

El sistema permite:

- Crear proyectos inmobiliarios
- Clasificarlos por tipo (Residencial, Comercial, Mixto)
- Visualizar su estado
- Mostrar métricas dinámicas

La implementación fue desarrollada utilizando **Programación Orientada a Objetos avanzada en JavaScript (ES2022+)**, aplicando principios de encapsulamiento, herencia y abstracción.

---

## 🧠 Enfoque del Dominio

El dominio modelado corresponde a una plataforma donde:

- Existen diferentes tipos de proyectos inmobiliarios.
- Todos comparten características comunes.
- Cada tipo tiene comportamiento especializado.
- Un sistema central administra los proyectos.

Se diseñó una arquitectura basada en:

- Clase base general (`Project`)
- Clases hijas especializadas
- Un sistema gestor (`ProjectSystem`)
- Integración con el DOM

---

# 🏗️ Arquitectura Implementada

## 1️⃣ Clase Base: `Project`

Representa la estructura general de cualquier proyecto inmobiliario.

### 🔒 Encapsulamiento

Se utilizaron **campos privados**:

```javascript
#name
#location
#goal
#returnValue
#isActive
```

Esto garantiza que las propiedades no puedan ser modificadas directamente desde fuera de la clase.

---

### 🎯 Constructor

Inicializa:

- Nombre
- Ubicación
- Meta de financiamiento
- Rentabilidad estimada
- Estado activo por defecto

Además, incrementa un contador estático global de proyectos.

---

### 🔎 Getters y Setter

Se implementaron getters para exponer los datos de forma controlada:

- `get name()`
- `get location()`
- `get goal()`
- `get returnValue()`
- `get isActive()`

Y un setter para modificar el estado:

```javascript
set isActive(status)
```

---

### 📊 Método Estático

```javascript
static getTotalProjects()
```

Permite obtener el total de proyectos creados sin necesidad de instanciar la clase.

---

### ⚙ Static Block

```javascript
static {
  console.log("Sistema de Proyectos Inicializado");
}
```

Se ejecuta una vez al cargar la clase, útil para inicialización global.

---

## 2️⃣ Herencia

Se implementó herencia utilizando `extends` y `super()`.

Clases hijas:

- `ResidentialProject`
- `CommercialProject`
- `MixedProject`

Cada una:

- Hereda de `Project`
- Llama a `super(...)`
- Define su propio tipo

Esto permite reutilización de código y especialización por categoría inmobiliaria.

---

## 3️⃣ Clase Administradora: `ProjectSystem`

Representa el sistema central de la plataforma.

### 🔒 Campo Privado

```javascript
#projects = []
```

La lista de proyectos no puede ser manipulada directamente desde el exterior.

---

### Métodos Públicos

- `addProject(project)`
- `getAllProjects()`

Se implementa un patrón de encapsulación donde el sistema controla el acceso a los datos.

---

# 🔗 Integración con el DOM

La lógica de la aplicación se conecta con la interfaz mediante:

- `DOMContentLoaded`
- Eventos `click`
- Evento `submit` del formulario

### Flujo de guardado:

1. Usuario llena formulario.
2. Se crea instancia según el tipo seleccionado.
3. Se añade al `ProjectSystem`.
4. Se renderizan tarjetas dinámicamente.
5. Se actualizan métricas.

---

# 📈 Métricas Dinámicas

Se actualizan automáticamente:

- Total de proyectos
- Proyectos activos
- Proyectos finalizados

Utilizando:

```javascript
Project.getTotalProjects()
```

Y filtros sobre el array interno del sistema.

---

# 🎯 Principios Aplicados

✔ Encapsulamiento  
✔ Abstracción  
✔ Herencia  
✔ Responsabilidad única  
✔ Separación entre lógica y vista  
✔ Uso moderno de JavaScript ES2022  

---

# 🚀 Ventajas de esta Implementación

- Código modular y escalable
- Seguridad en datos gracias a campos privados
- Arquitectura clara y mantenible
- Preparado para futuras extensiones (inversionistas, inversiones, persistencia)

---

# 🔮 Posibles Mejoras Futuras

- Implementar `localStorage` con serialización de clases
- Sistema de inversión real entre usuarios y proyectos
- Persistencia en backend
- Control de roles (Admin / Investor)
- Dashboard avanzado con gráficos

---

# 📌 Conclusión

Esta implementación modela correctamente el dominio de una plataforma de crowdfunding inmobiliario utilizando principios avanzados de Programación Orientada a Objetos en JavaScript.

El sistema demuestra:

- Dominio de conceptos modernos del lenguaje.
- Aplicación práctica de POO en un caso real.
- Arquitectura limpia y organizada.