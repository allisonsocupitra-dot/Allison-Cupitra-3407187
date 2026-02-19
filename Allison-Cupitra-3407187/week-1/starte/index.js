/* ============================================
   PROYECTO SEMANA 01 - CROWDFUNDING INMOBILIARIO
   ============================================ */

// ============================================
// 1️⃣ Datos del Proyecto Inmobiliario
// ============================================

const entityData = {
  name: 'Torre Verde Residencial',
  description: 'Proyecto de apartamentos sostenibles con alta rentabilidad en zona de crecimiento urbano.',
  identifier: 'PRJ-INV-2026',

  contact: {
    email: 'inversiones@torreverde.com',
    phone: '+57 300 123 4567',
    location: 'Medellín, Colombia'
  },

  // Progreso de financiación (se usa como barra dinámica)
  funding: {
    goal: 500000,
    raised: 375000
  },

  // Características del proyecto
  items: [
    { name: 'Ubicación Estratégica', level: 95 },
    { name: 'Rentabilidad Estimada', level: 88 },
    { name: 'Sostenibilidad', level: 92 },
    { name: 'Plusvalía Proyectada', level: 85 },
    { name: 'Demanda del Sector', level: 90 }
  ],

  // Inversionistas simulados
  links: [
    { platform: 'Carlos M.', url: '#', icon: '👤' },
    { platform: 'Laura G.', url: '#', icon: '👤' },
    { platform: 'Andrés R.', url: '#', icon: '👤' }
  ],

  stats: {
    investors: 128,
    fundedPercent: 75,
    rating: 4.9,
    daysLeft: 18
  }
};

// ============================================
// 2️⃣ Referencias al DOM
// ============================================

const projectName = document.getElementById('projectName');
const projectDescription = document.getElementById('projectDescription');
const projectLocation = document.getElementById('projectLocation');
const minimumInvestment = document.getElementById('minimumInvestment');
const expectedReturn = document.getElementById('expectedReturn');
const investmentTerm = document.getElementById('investmentTerm');

const fundingProgress = document.getElementById('fundingProgress');
const investorsList = document.getElementById('investorsList');
const statsContainer = document.getElementById('stats');

const themeToggle = document.getElementById('themeToggle');
const investBtn = document.getElementById('investBtn');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ============================================
// 3️⃣ Renderizar información básica
// ============================================

const renderBasicInfo = () => {
  const {
    name,
    description,
    contact: { location } = {},
    funding: { goal, raised } = {}
  } = entityData;

  projectName.textContent = name;
  projectDescription.textContent = description;
  projectLocation.textContent = `📍 ${location ?? 'Ubicación no disponible'}`;

  minimumInvestment.textContent = `💰 Inversión mínima: $500 USD`;
  expectedReturn.textContent = `📈 Retorno estimado: 12% anual`;
  investmentTerm.textContent = `⏳ Plazo: 24 meses`;

  // Barra de progreso dinámica
  const percent = Math.round((raised / goal) * 100);

  fundingProgress.innerHTML = `
    <div class="progress-container">
      <div class="progress-bar" style="width:${percent}%"></div>
    </div>
    <p class="progress-text">${percent}% financiado (${raised.toLocaleString()} / ${goal.toLocaleString()} USD)</p>
  `;
};

// ============================================
// 4️⃣ Renderizar características del proyecto
// ============================================

let showingAllItems = false;

const renderItems = (showAll = false) => {
  const { items } = entityData;

  const itemsToShow = showAll ? items : items.slice(0, 4);

  const itemsHtml = itemsToShow.map(({ name, level }) => `
      <div class="skill-item">
        <div class="skill-name">${name}</div>
        <div class="skill-level">
          <span>${level}%</span>
          <div class="skill-bar">
            <div class="skill-bar-fill" style="width:${level}%"></div>
          </div>
        </div>
      </div>
  `).join('');

  fundingProgress.insertAdjacentHTML('beforeend', `<div class="skills-list">${itemsHtml}</div>`);
};

// ============================================
// 5️⃣ Renderizar inversionistas
// ============================================

const renderLinks = () => {
  const { links } = entityData;

  const linksHtml = links.map(({ platform, url, icon }) => `
    <a href="${url}" target="_blank" class="social-link">
      ${icon} ${platform}
    </a>
  `).join('');

  investorsList.innerHTML = linksHtml;
};

// ============================================
// 6️⃣ Renderizar estadísticas
// ============================================

const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: 'Inversionistas', value: stats.investors },
    { label: 'Financiado', value: `${stats.fundedPercent}%` },
    { label: 'Rating', value: stats.rating },
    { label: 'Días Restantes', value: stats.daysLeft }
  ];

  const statsHtml = statsArray.map(({ label, value }) => `
    <div class="stat-item">
      <span class="stat-value">${value}</span>
      <span class="stat-label">${label}</span>
    </div>
  `).join('');

  statsContainer.innerHTML = statsHtml;
};

// ============================================
// 7️⃣ Cambio de tema
// ============================================

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme ?? 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.dataset.theme = newTheme;
  themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';

  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
};

// ============================================
// 8️⃣ Simular inversión
// ============================================

const handleInvestment = () => {
  showToast('✅ ¡Inversión realizada con éxito!');
};

// ============================================
// 9️⃣ Toast
// ============================================

const showToast = message => {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// ============================================
// 🔟 Event Listeners
// ============================================

themeToggle.addEventListener('click', toggleTheme);
investBtn.addEventListener('click', handleInvestment);

// ============================================
// 1️⃣1️⃣ Inicialización
// ============================================
const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();

  console.log('✅ Plataforma Crowdfunding inicializada correctamente');
};

// Espera a que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', init);
