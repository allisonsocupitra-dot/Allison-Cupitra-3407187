/* ============================================
   PLATAFORMA CROWDFUNDING INMOBILIARIO
   ============================================ */

// ============================================
// ESTADO GLOBAL
// ============================================

let items = [];
let editingItemId = null;

// ============================================
// CATEGORÍAS (Tipo de inmueble)
// ============================================

const CATEGORIES = {
  residencial: { name: 'Residencial', emoji: '🏠' },
  comercial: { name: 'Comercial', emoji: '🏢' },
  industrial: { name: 'Industrial', emoji: '🏭' },
  mixto: { name: 'Uso Mixto', emoji: '🏘️' },
};

const PRIORITIES = {
  high: { name: 'Alto Riesgo', color: '#dc2626' },
  medium: { name: 'Riesgo Medio', color: '#f59e0b' },
  low: { name: 'Bajo Riesgo', color: '#16a34a' },
};

// ============================================
// PERSISTENCIA
// ============================================

const loadItems = () =>
  JSON.parse(localStorage.getItem('realEstateProjects') ?? '[]');

const saveItems = itemsToSave =>
  localStorage.setItem('realEstateProjects', JSON.stringify(itemsToSave));

// ============================================
// UTILIDAD: calcular porcentaje financiación
// ============================================

const calculateProgress = (goal = 0, raised = 0) =>
  goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

// ============================================
// CRUD - CREAR
// ============================================

const createItem = (itemData = {}) => {
  const {
    name = '',
    description = '',
    category = 'residencial',
    priority = 'medium',
    investmentGoal = 0,
    amountRaised = 0,
    deadline = ''
  } = itemData;

  const progress = calculateProgress(investmentGoal, amountRaised);

  const newItem = {
    id: Date.now(),
    name,
    description,
    category,
    priority,
    investmentGoal: Number(investmentGoal),
    amountRaised: Number(amountRaised),
    progress,
    active: progress < 100,
    deadline,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

// ============================================
// CRUD - ACTUALIZAR
// ============================================

const updateItem = (id, updates) => {
  const updatedItems = items.map(item => {
    if (item.id !== id) return item;

    const updatedGoal = updates.investmentGoal ?? item.investmentGoal;
    const updatedRaised = updates.amountRaised ?? item.amountRaised;
    const progress = calculateProgress(updatedGoal, updatedRaised);

    return {
      ...item,
      ...updates,
      investmentGoal: Number(updatedGoal),
      amountRaised: Number(updatedRaised),
      progress,
      active: progress < 100,
      updatedAt: new Date().toISOString()
    };
  });

  saveItems(updatedItems);
  return updatedItems;
};

// ============================================
// CRUD - ELIMINAR
// ============================================

const deleteItem = id => {
  const filtered = items.filter(item => item.id !== id);
  saveItems(filtered);
  return filtered;
};

// ============================================
// FILTROS
// ============================================

const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'all') return itemsToFilter;
  if (status === 'active') return itemsToFilter.filter(i => i.active);
  if (status === 'funded') return itemsToFilter.filter(i => !i.active);
  return itemsToFilter;
};

const filterByCategory = (itemsToFilter, category = 'all') =>
  category === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.category === category);

const filterByPriority = (itemsToFilter, priority = 'all') =>
  priority === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.priority === priority);

const searchItems = (itemsToFilter, query = '') => {
  if (!query.trim()) return itemsToFilter;
  const term = query.toLowerCase();
  return itemsToFilter.filter(item =>
    item.name.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term)
  );
};

const applyFilters = (itemsToFilter, filters = {}) => {
  const {
    status = 'all',
    category = 'all',
    priority = 'all',
    search = ''
  } = filters;

  let result = filterByStatus(itemsToFilter, status);
  result = filterByCategory(result, category);
  result = filterByPriority(result, priority);
  result = searchItems(result, search);

  return result;
};

// ============================================
// ESTADÍSTICAS
// ============================================

const getStats = (itemsToAnalyze = []) => {
  const total = itemsToAnalyze.length;
  const active = itemsToAnalyze.filter(i => i.active).length;
  const funded = total - active;

  const totalInvestment = itemsToAnalyze.reduce(
    (acc, item) => acc + item.amountRaised,
    0
  );

  return { total, active, funded, totalInvestment };
};

// ============================================
// RENDER
// ============================================

const renderItem = item => {
  const {
    id,
    name,
    description,
    category,
    priority,
    investmentGoal,
    amountRaised,
    progress
  } = item;

  return `
    <div class="project-item risk-${priority}" data-item-id="${id}">
      <h3>${CATEGORIES[category]?.emoji} ${name}</h3>
      <p>${description ?? ''}</p>

      <div class="progress-container">
        <div class="progress-bar" style="width:${progress}%"></div>
      </div>

      <div class="progress-text">
        💰 $${amountRaised.toLocaleString()} / $${investmentGoal.toLocaleString()} 
        (${progress.toFixed(1)}%)
      </div>

      <div class="task-actions">
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </div>
    </div>
  `;
};

const renderItems = itemsToRender => {
  const list = document.getElementById('item-list');
  const empty = document.getElementById('empty-state');

  if (!itemsToRender.length) {
    list.innerHTML = '';
    empty.classList.add('show');
  } else {
    empty.classList.remove('show');
    list.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-funded').textContent = stats.funded;

  document.getElementById('stats-details').innerHTML = `
    <div class="stat-card">
      <h4>Total Invertido</h4>
      <p>$${stats.totalInvestment.toLocaleString()}</p>
    </div>
  `;
};

// ============================================
// EVENTOS
// ============================================

const handleFormSubmit = e => {
  e.preventDefault();

  const name = document.getElementById('item-name').value.trim();
  if (!name) return alert('El nombre es obligatorio');

  const itemData = {
    name,
    description: document.getElementById('item-description').value,
    category: document.getElementById('item-category').value,
    priority: document.getElementById('item-priority').value,
    investmentGoal: document.getElementById('investment-goal').value,
    amountRaised: document.getElementById('amount-raised').value,
    deadline: document.getElementById('deadline').value
  };

  items = editingItemId
    ? updateItem(editingItemId, itemData)
    : createItem(itemData);

  resetForm();
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const handleItemDelete = id => {
  if (!confirm('¿Eliminar este proyecto?')) return;
  items = deleteItem(id);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const getCurrentFilters = () => ({
  status: document.getElementById('filter-status').value,
  category: document.getElementById('filter-category').value,
  priority: document.getElementById('filter-priority').value,
  search: document.getElementById('search-input').value
});

const applyCurrentFilters = () =>
  applyFilters(items, getCurrentFilters());

const resetForm = () => {
  document.getElementById('item-form').reset();
  editingItemId = null;
};

const attachEventListeners = () => {
  document.getElementById('item-form')
    .addEventListener('submit', handleFormSubmit);

  document.getElementById('item-list')
    .addEventListener('click', e => {
      const card = e.target.closest('.project-item');
      if (!card) return;
      const id = Number(card.dataset.itemId);

      if (e.target.classList.contains('btn-delete'))
        handleItemDelete(id);
    });

  ['filter-status','filter-category','filter-priority']
    .forEach(id =>
      document.getElementById(id)
        .addEventListener('change', () =>
          renderItems(applyCurrentFilters())
        )
    );

  document.getElementById('search-input')
    .addEventListener('input', () =>
      renderItems(applyCurrentFilters())
    );
};

// ============================================
// INIT
// ============================================

const init = () => {
  items = loadItems();
  renderItems(items);
  renderStats(getStats(items));
  attachEventListeners();
  console.log('🏢 Plataforma Crowdfunding lista');
};

document.addEventListener('DOMContentLoaded', init);
