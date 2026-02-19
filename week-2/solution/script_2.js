/**
 * ============================================
 * PROYECTO SEMANA 02 - GESTOR DE PROYECTOS INMOBILIARIOS
 * Crowdfunding Inmobiliario - PropFund
 * ============================================
 *
 * Este archivo maneja toda la logica de la aplicacion
 * Aprendi que hay que separar la logica del HTML, asi que lo hice
 * Trate de usar todo lo que vimos esta semana en clase
 *
 * ============================================
 */

// ============================================
// ESTADO GLOBAL
// ============================================

// Aqui voy a guardar todos los proyectos que cree el usuario
let items = [];

// Esto lo uso para saber si estoy editando un proyecto o creando uno nuevo
// Si es null significa que es nuevo
let editingItemId = null;

// ============================================
// CATEGORIAS Y PRIORIDADES DE MI DOMINIO
// ============================================

// Defini las categorias de proyectos inmobiliarios
// Cada una tiene un nombre y un emoji para que se vea bonito en pantalla
const CATEGORIES = {
  residential: { name: 'Residencial', emoji: '🏠' },
  commercial:  { name: 'Comercial',   emoji: '🏢' },
  land:        { name: 'Lote / Tierra', emoji: '🌿' },
  industrial:  { name: 'Industrial',  emoji: '🏭' },
  mixed:       { name: 'Uso Mixto',   emoji: '🏙️' },
  other:       { name: 'Otro',        emoji: '📌' },
};

// Los niveles de riesgo del proyecto (antes se llamaban prioridades en la plantilla)
// Baje, medio y alto - igual que en bolsa de valores jeje
const PRIORITIES = {
  high:   { name: 'Alto',  color: '#ef4444' },
  medium: { name: 'Medio', color: '#f59e0b' },
  low:    { name: 'Bajo',  color: '#22c55e' },
};

// ============================================
// PERSISTENCIA - LocalStorage
// ============================================

/**
 * Carga los proyectos que habia guardado antes
 * Si no hay nada guardado retorna un array vacio
 */
const loadItems = () => {
  // Intento leer lo que habia guardado en el navegador
  // Si no hay nada guardado JSON.parse de null falla, por eso uso ?? '[]'
  return JSON.parse(localStorage.getItem('propfundProjects') ?? '[]');
};

/**
 * Guarda todos los proyectos en el navegador
 * @param {Array} itemsToSave - el array con todos los proyectos
 */
const saveItems = itemsToSave => {
  // Convierto el array a texto para poder guardarlo
  localStorage.setItem('propfundProjects', JSON.stringify(itemsToSave));
};

// ============================================
// CRUD - CREAR PROYECTO
// ============================================

/**
 * Crea un proyecto nuevo y lo agrega al array
 * @param {Object} itemData - los datos que lleno el usuario en el formulario
 * @returns {Array} el array nuevo con el proyecto incluido
 */
const createItem = (itemData = {}) => {
  // Creo el objeto del proyecto con todos sus campos
  // Uso spread para no modificar el itemData original
  const newItem = {
    id:          Date.now(),                    // uso la fecha como id unico
    name:        itemData.name        ?? '',
    description: itemData.description ?? '',
    category:    itemData.category    ?? 'residential',
    priority:    itemData.priority    ?? 'medium',
    meta:        itemData.meta        ?? 0,     // meta de financiacion en dolares
    recaudado:   itemData.recaudado   ?? 0,     // cuanto han invertido hasta ahora
    tir:         itemData.tir         ?? '',    // tasa interna de retorno estimada
    active:      true,                          // todos los proyectos empiezan activos
    createdAt:   new Date().toISOString(),
    updatedAt:   null,
  };

  // Creo un array nuevo con el proyecto nuevo al final
  // Uso spread para no mutar el array original (lo aprendi en clase)
  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

// ============================================
// CRUD - ACTUALIZAR PROYECTO
// ============================================

/**
 * Actualiza los datos de un proyecto que ya existe
 * @param {Number} id - el id del proyecto que quiero editar
 * @param {Object} updates - los campos nuevos que quiero cambiar
 * @returns {Array} el array con el proyecto ya actualizado
 */
const updateItem = (id, updates) => {
  // Recorro todos los proyectos con map
  // Si el id coincide lo actualizo, si no lo dejo igual
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

// ============================================
// CRUD - ELIMINAR PROYECTO
// ============================================

/**
 * Elimina un proyecto por su id
 * @param {Number} id - el id del proyecto a eliminar
 * @returns {Array} el array sin ese proyecto
 */
const deleteItem = id => {
  // filter me devuelve un array nuevo sin el proyecto que quiero borrar
  const filteredItems = items.filter(item => item.id !== id);
  saveItems(filteredItems);
  return filteredItems;
};

// ============================================
// CRUD - TOGGLE ACTIVO / INACTIVO
// ============================================

/**
 * Cambia el estado del proyecto entre activo e inactivo
 * @param {Number} id - id del proyecto
 * @returns {Array} array con el proyecto actualizado
 */
const toggleItemActive = id => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

/**
 * Elimina todos los proyectos que esten inactivos
 * Util para limpiar los que ya no me sirven
 * @returns {Array} solo los proyectos activos
 */
const clearInactive = () => {
  const activeItems = items.filter(item => item.active);
  saveItems(activeItems);
  return activeItems;
};

// ============================================
// FILTROS Y BUSQUEDA
// ============================================

/**
 * Filtra por estado: todos, activos o inactivos
 * @param {Array} itemsToFilter
 * @param {String} status - 'all' | 'active' | 'inactive'
 * @returns {Array}
 */
const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'all')      return itemsToFilter;
  if (status === 'active')   return itemsToFilter.filter(item => item.active);
  if (status === 'inactive') return itemsToFilter.filter(item => !item.active);
  return itemsToFilter;
};

/**
 * Filtra por tipo de inmueble
 * @param {Array} itemsToFilter
 * @param {String} category - 'all' o el nombre de la categoria
 * @returns {Array}
 */
const filterByCategory = (itemsToFilter, category = 'all') => {
  if (category === 'all') return itemsToFilter;
  return itemsToFilter.filter(item => item.category === category);
};

/**
 * Filtra por nivel de riesgo
 * @param {Array} itemsToFilter
 * @param {String} priority - 'all' | 'high' | 'medium' | 'low'
 * @returns {Array}
 */
const filterByPriority = (itemsToFilter, priority = 'all') => {
  if (priority === 'all') return itemsToFilter;
  return itemsToFilter.filter(item => item.priority === priority);
};

/**
 * Busca proyectos por texto en nombre o descripcion
 * @param {Array} itemsToFilter
 * @param {String} query - texto que escribio el usuario
 * @returns {Array}
 */
const searchItems = (itemsToFilter, query) => {
  // Si el campo de busqueda esta vacio devuelvo todo
  if (!query || query.trim() === '') return itemsToFilter;

  const searchTerm = query.toLowerCase();

  return itemsToFilter.filter(item =>
    item.name.toLowerCase().includes(searchTerm) ||
    (item.description ?? '').toLowerCase().includes(searchTerm)
  );
};

/**
 * Aplica todos los filtros juntos de una vez
 * @param {Array} itemsToFilter
 * @param {Object} filters - objeto con todos los filtros activos
 * @returns {Array}
 */
const applyFilters = (itemsToFilter, filters = {}) => {
  // Saco cada filtro del objeto con destructuring
  // Si no viene algun filtro uso 'all' o '' por defecto
  const {
    status   = 'all',
    category = 'all',
    priority = 'all',
    search   = '',
  } = filters;

  // Encadeno los filtros uno por uno
  let result = filterByStatus(itemsToFilter, status);
  result = filterByCategory(result, category);
  result = filterByPriority(result, priority);
  result = searchItems(result, search);
  return result;
};

// ============================================
// ESTADISTICAS
// ============================================

/**
 * Calcula estadisticas de toda la cartera de proyectos
 * @param {Array} itemsToAnalyze
 * @returns {Object} objeto con los numeros importantes
 */
const getStats = (itemsToAnalyze = []) => {
  const total    = itemsToAnalyze.length;
  const active   = itemsToAnalyze.filter(item => item.active).length;
  const inactive = total - active;

  // Cuanto dinero se ha recaudado en total entre todos los proyectos
  const totalRecaudado = itemsToAnalyze.reduce((acc, item) => {
    return acc + (Number(item.recaudado) || 0);
  }, 0);

  // Cuanto es la meta total sumando todos los proyectos
  const totalMeta = itemsToAnalyze.reduce((acc, item) => {
    return acc + (Number(item.meta) || 0);
  }, 0);

  // Cuantos proyectos hay por cada tipo de inmueble
  const byCategory = itemsToAnalyze.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  // Cuantos proyectos hay por nivel de riesgo
  const byPriority = itemsToAnalyze.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] ?? 0) + 1;
    return acc;
  }, {});

  return { total, active, inactive, totalRecaudado, totalMeta, byCategory, byPriority };
};

// ============================================
// RENDERIZADO - HELPERS
// ============================================

/**
 * Devuelve el emoji de una categoria
 * @param {String} category
 * @returns {String}
 */
const getCategoryEmoji = category => {
  return CATEGORIES[category]?.emoji ?? '📌';
};

/**
 * Convierte una fecha ISO a algo legible en español
 * @param {String} dateString
 * @returns {String}
 */
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
};

/**
 * Formatea un numero como moneda en dolares
 * @param {Number} number
 * @returns {String}
 */
const formatMoney = number => {
  // Si no hay numero devuelvo un guion
  if (!number && number !== 0) return '—';
  return '$' + Number(number).toLocaleString('en-US');
};

// ============================================
// RENDERIZADO - PROYECTO INDIVIDUAL
// ============================================

/**
 * Convierte un proyecto en HTML para mostrarlo en pantalla
 * @param {Object} item - el proyecto
 * @returns {String} el HTML del proyecto
 */
const renderItem = item => {
  // Saco las propiedades que necesito con destructuring
  const { id, name, description, category, priority, active,
          createdAt, meta, recaudado, tir } = item;

  // Calculo el porcentaje de financiacion para la barra de progreso
  const porcentaje = meta ? Math.min(100, Math.round((recaudado / meta) * 100)) : 0;

  // Armo el HTML del proyecto con template literals
  return `
    <div class="item-card ${active ? '' : 'inactive'} priority-${priority}" data-item-id="${id}">

      <div class="item-content">
        <h3 class="item-content">${name}</h3>

        ${description ? `<p>${description}</p>` : ''}

        <div class="item-meta">
          <span class="item-badge badge-category">
            ${getCategoryEmoji(category)} ${CATEGORIES[category]?.name ?? category}
          </span>
          <span class="item-badge badge-priority priority-${priority}">
            ⚠️ Riesgo ${PRIORITIES[priority]?.name ?? priority}
          </span>
          <span class="badge-status ${active ? 'active' : 'inactive'}">
            ${active ? '✅ Activo' : '⏸️ Inactivo'}
          </span>
          ${tir ? `<span class="item-badge" style="background:#d1fae5;color:#065f46">📈 TIR ${tir}%</span>` : ''}
        </div>

        ${meta ? `
        <div class="funding-info">
          <div class="funding-labels">
            <span>Recaudado: ${formatMoney(recaudado)}</span>
            <span>Meta: ${formatMoney(meta)} · ${porcentaje}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${porcentaje}%"></div>
          </div>
        </div>` : ''}

        <span class="item-date">📅 Creado el ${formatDate(createdAt)}</span>
      </div>

      <div class="item-actions">
        <button class="btn-edit"   title="Editar proyecto">✏️</button>
        <button class="btn-delete" title="Eliminar proyecto">🗑️</button>
      </div>

    </div>
  `;
};

// ============================================
// RENDERIZADO - LISTA COMPLETA
// ============================================

/**
 * Pinta todos los proyectos en el HTML
 * @param {Array} itemsToRender
 */
const renderItems = itemsToRender => {
  const itemList   = document.getElementById('item-list');
  const emptyState = document.getElementById('empty-state');

  if (itemsToRender.length === 0) {
    // Si no hay proyectos muestro el mensaje vacio
    itemList.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    // Convierto cada proyecto en HTML y los uno en un solo string
    emptyState.style.display = 'none';
    itemList.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

/**
 * Actualiza los numeros de estadisticas en el HTML
 * @param {Object} stats
 */
const renderStats = stats => {
  // Actualizo el header con los totales
  document.getElementById('stat-total').textContent    = stats.total;
  document.getElementById('stat-active').textContent   = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;

  // Armo las tarjetas de estadisticas por categoria y riesgo
  const categoryCards = Object.entries(stats.byCategory)
    .map(([cat, count]) => `
      <div class="stat-card">
        <h4>${getCategoryEmoji(cat)} ${CATEGORIES[cat]?.name ?? cat}</h4>
        <p>${count}</p>
      </div>
    `).join('');

  const priorityCards = Object.entries(stats.byPriority)
    .map(([pri, count]) => `
      <div class="stat-card">
        <h4>Riesgo ${PRIORITIES[pri]?.name ?? pri}</h4>
        <p>${count}</p>
      </div>
    `).join('');

  // Tarjetas de dinero
  const moneyCards = `
    <div class="stat-card">
      <h4>💰 Total Recaudado</h4>
      <p style="font-size:1.3rem">${formatMoney(stats.totalRecaudado)}</p>
    </div>
    <div class="stat-card">
      <h4>🎯 Meta Total</h4>
      <p style="font-size:1.3rem">${formatMoney(stats.totalMeta)}</p>
    </div>
  `;

  document.getElementById('stats-details').innerHTML = moneyCards + categoryCards + priorityCards;
};

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Se ejecuta cuando el usuario envia el formulario
 * Puede ser para crear un proyecto nuevo o para editar uno
 * @param {Event} e
 */
const handleFormSubmit = e => {
  // Evito que la pagina se recargue sola
  e.preventDefault();

  // Leo todos los campos del formulario
  const name        = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-description').value.trim();
  const category    = document.getElementById('item-category').value;
  const priority    = document.getElementById('item-priority').value;
  const meta        = document.getElementById('item-meta').value;
  const recaudado   = document.getElementById('item-recaudado').value;
  const tir         = document.getElementById('item-tir').value;

  // El nombre es obligatorio, sin eso no puedo guardar
  if (!name) {
    alert('El nombre del proyecto es obligatorio 😅');
    return;
  }

  // Junto todos los datos en un objeto
  const itemData = { name, description, category, priority, meta, recaudado, tir };

  // Si hay un id en edicion actualizo, si no creo uno nuevo
  if (editingItemId) {
    items = updateItem(editingItemId, itemData);
  } else {
    items = createItem(itemData);
  }

  // Limpio el formulario y actualizo lo que se ve en pantalla
  resetForm();
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

/**
 * Cambia un proyecto entre activo e inactivo
 * @param {Number} itemId
 */
const handleItemToggle = itemId => {
  items = toggleItemActive(itemId);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

/**
 * Rellena el formulario con los datos del proyecto para editarlo
 * @param {Number} itemId
 */
const handleItemEdit = itemId => {
  // Busco el proyecto por su id
  const itemToEdit = items.find(item => item.id === itemId);
  if (!itemToEdit) return;

  // Relleno cada campo del formulario con los datos que tenia
  document.getElementById('item-name').value        = itemToEdit.name;
  document.getElementById('item-description').value = itemToEdit.description ?? '';
  document.getElementById('item-category').value    = itemToEdit.category;
  document.getElementById('item-priority').value    = itemToEdit.priority;
  document.getElementById('item-meta').value        = itemToEdit.meta        ?? '';
  document.getElementById('item-recaudado').value   = itemToEdit.recaudado   ?? '';
  document.getElementById('item-tir').value         = itemToEdit.tir         ?? '';

  // Cambio el titulo y los botones del formulario para que se note que estoy editando
  document.getElementById('form-title').textContent         = '✏️ Editar Proyecto';
  document.getElementById('submit-btn').textContent         = 'Guardar Cambios';
  document.getElementById('cancel-btn').style.display       = 'inline-block';

  // Guardo el id del proyecto que estoy editando
  editingItemId = itemId;

  // Subo la pagina para que el usuario vea el formulario
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Elimina un proyecto despues de pedir confirmacion
 * @param {Number} itemId
 */
const handleItemDelete = itemId => {
  if (!confirm('¿Seguro que quieres eliminar este proyecto? No se puede deshacer.')) return;
  items = deleteItem(itemId);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

// ============================================
// FILTROS - HELPERS
// ============================================

/**
 * Lee los valores actuales de todos los filtros del HTML
 * @returns {Object}
 */
const getCurrentFilters = () => {
  return {
    status:   document.getElementById('filter-status').value,
    category: document.getElementById('filter-category').value,
    priority: document.getElementById('filter-priority').value,
    search:   document.getElementById('search-input').value,
  };
};

/**
 * Aplica los filtros que estan activos ahora mismo
 * @returns {Array}
 */
const applyCurrentFilters = () => {
  const filters = getCurrentFilters();
  return applyFilters(items, filters);
};

/**
 * Se ejecuta cada vez que el usuario cambia un filtro
 */
const handleFilterChange = () => {
  const filteredItems = applyCurrentFilters();
  renderItems(filteredItems);
};

// ============================================
// RESET DEL FORMULARIO
// ============================================

/**
 * Deja el formulario como si fuera la primera vez
 */
const resetForm = () => {
  document.getElementById('item-form').reset();
  document.getElementById('form-title').textContent   = '➕ Nuevo Proyecto';
  document.getElementById('submit-btn').textContent   = 'Crear Proyecto';
  document.getElementById('cancel-btn').style.display = 'none';
  editingItemId = null;
};

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Aqui conecto todos los botones y formularios con sus funciones
 */
const attachEventListeners = () => {
  // Formulario - cuando el usuario da click en crear o guardar
  document.getElementById('item-form').addEventListener('submit', handleFormSubmit);

  // Boton cancelar - deja el formulario limpio
  document.getElementById('cancel-btn').addEventListener('click', resetForm);

  // Filtros - cada vez que cambia algo vuelvo a filtrar
  document.getElementById('filter-status').addEventListener('change', handleFilterChange);
  document.getElementById('filter-category').addEventListener('change', handleFilterChange);
  document.getElementById('filter-priority').addEventListener('change', handleFilterChange);

  // La busqueda filtra mientras el usuario escribe
  document.getElementById('search-input').addEventListener('input', handleFilterChange);

  // Boton para eliminar todos los inactivos de una vez
  document.getElementById('clear-inactive').addEventListener('click', () => {
    if (!confirm('¿Eliminar todos los proyectos inactivos?')) return;
    items = clearInactive();
    renderItems(applyCurrentFilters());
    renderStats(getStats(items));
  });

  // Event delegation - en vez de poner un listener en cada tarjeta
  // pongo uno solo en la lista y detecto en cual tarjeta se hizo click
  document.getElementById('item-list').addEventListener('click', e => {
    // Busco el elemento padre que tenga el data-item-id
    const itemElement = e.target.closest('[data-item-id]');
    if (!itemElement) return;

    // El id viene como string del HTML, lo convierto a numero
    const itemId = parseInt(itemElement.dataset.itemId);

    if (e.target.classList.contains('btn-edit')) {
      handleItemEdit(itemId);
    } else if (e.target.classList.contains('btn-delete')) {
      handleItemDelete(itemId);
    }
  });
};

// ============================================
// INICIALIZACION
// ============================================

/**
 * Arranca la aplicacion cuando el HTML ya esta listo
 */
const init = () => {
  // Cargo lo que habia guardado antes en el navegador
  items = loadItems();

  // Muestro los proyectos y las estadisticas
  renderItems(items);
  renderStats(getStats(items));

  // Conecto todos los botones
  attachEventListeners();

  console.log('✅ PropFund inicializado correctamente');
  console.log(`📦 Se cargaron ${items.length} proyectos desde localStorage`);
};

// Espero a que el HTML cargue completamente antes de arrancar
document.addEventListener('DOMContentLoaded', init);