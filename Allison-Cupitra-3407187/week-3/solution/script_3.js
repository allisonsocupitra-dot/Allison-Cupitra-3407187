document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // SISTEMA CON POO AVANZADA
  // ===============================

  class Project {

    static totalProjects = 0;

    static {
      console.log("Sistema de Proyectos Inicializado");
    }

    #name;
    #location;
    #goal;
    #returnValue;
    #isActive;

    constructor(name, location, goal, returnValue) {
      this.#name = name;
      this.#location = location;
      this.#goal = goal;
      this.#returnValue = returnValue;
      this.#isActive = true;

      Project.totalProjects++;
    }

    // Getters
    get name() { return this.#name; }
    get location() { return this.#location; }
    get goal() { return this.#goal; }
    get returnValue() { return this.#returnValue; }
    get isActive() { return this.#isActive; }

    // Setter
    set isActive(status) {
      this.#isActive = status;
    }

    // Método común
    getInfo() {
      return `${this.#name} - ${this.#location}`;
    }

    // Método estático
    static getTotalProjects() {
      return Project.totalProjects;
    }
  }

  // ===============================
  // HERENCIA
  // ===============================

  class ResidentialProject extends Project {
    constructor(name, location, goal, returnValue) {
      super(name, location, goal, returnValue);
      this.type = "Residencial";
    }
  }

  class CommercialProject extends Project {
    constructor(name, location, goal, returnValue) {
      super(name, location, goal, returnValue);
      this.type = "Comercial";
    }
  }

  class MixedProject extends Project {
    constructor(name, location, goal, returnValue) {
      super(name, location, goal, returnValue);
      this.type = "Mixto";
    }
  }

  // ===============================
  // SISTEMA ADMINISTRADOR
  // ===============================

  class ProjectSystem {

    #projects = [];

    addProject(project) {
      this.#projects.push(project);
      return { success: true };
    }

    getAllProjects() {
      return this.#projects;
    }
  }

  const system = new ProjectSystem();

  // ===============================
  // CONEXIÓN DOM
  // ===============================

  const addBtn = document.getElementById('add-item-btn');
  const modal = document.getElementById('item-modal');
  const closeModal = document.getElementById('close-modal');
  const cancelBtn = document.getElementById('cancel-btn');
  const form = document.getElementById('item-form');
  const itemList = document.getElementById('item-list');
  const emptyState = document.getElementById('empty-state');

  addBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // ===============================
  // GUARDAR PROYECTO
  // ===============================

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('item-type').value;
    const name = document.getElementById('item-name').value;
    const location = document.getElementById('item-location').value;
    const goal = Number(document.getElementById('project-goal').value);
    const returnValue = Number(document.getElementById('project-return').value);

    let newProject;

    if (type === 'Residencial') {
      newProject = new ResidentialProject(name, location, goal, returnValue);
    } 
    else if (type === 'Comercial') {
      newProject = new CommercialProject(name, location, goal, returnValue);
    } 
    else if (type === 'Mixto') {
      newProject = new MixedProject(name, location, goal, returnValue);
    }

    system.addProject(newProject);
    renderProjects();

    modal.style.display = 'none';
    form.reset();
  });

  // ===============================
  // RENDERIZAR
  // ===============================

  function renderProjects() {

    itemList.innerHTML = '';

    const projects = system.getAllProjects();

    if (projects.length === 0) {
      emptyState.style.display = 'block';
      return;
    } else {
      emptyState.style.display = 'none';
    }

    projects.forEach(project => {

      const card = document.createElement('div');
      card.classList.add('item-card');

      card.innerHTML = `
        <h3>${project.name}</h3>
        <p><strong>Tipo:</strong> ${project.type}</p>
        <p><strong>Ubicación:</strong> ${project.location}</p>
        <p><strong>Meta:</strong> $${project.goal}</p>
        <p><strong>Rentabilidad:</strong> ${project.returnValue}%</p>
        <p><strong>Estado:</strong> ${project.isActive ? 'Activo' : 'Finalizado'}</p>
      `;

      itemList.appendChild(card);
    });

    // Actualizar métricas
    document.getElementById('stat-total').textContent = Project.getTotalProjects();
    document.getElementById('stat-active').textContent =
      projects.filter(p => p.isActive).length;
    document.getElementById('stat-inactive').textContent =
      projects.filter(p => !p.isActive).length;
  }

  renderProjects();

});