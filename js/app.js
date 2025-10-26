// Lógica del frontend modularizada para permitir pruebas automatizadas
// Comentarios en español: este archivo simula un login y un panel de opciones para un ambiente de pruebas.

// Usuario de prueba
const DEMO_USER = { username: 'demo', password: 'test', name: 'Usuario Demo' };

// Contenedor para elementos del DOM que se inicializan en initApp()
let elements = {};

// Inicializar la aplicación (buscar elementos y registrar listeners)
function initApp() {
  // Buscar elementos del DOM (se hace aquí para que en tests podamos inyectar el HTML primero)
  elements.loginForm = document.getElementById('login-form');
  elements.usernameInput = document.getElementById('username');
  elements.passwordInput = document.getElementById('password');
  elements.btnClear = document.getElementById('btn-clear');
  elements.dashboard = document.getElementById('dashboard');
  elements.navDashboardLink = document.getElementById('nav-dashboard-link');
  elements.navLogin = document.getElementById('nav-login');
  elements.btnLogout = document.getElementById('btn-logout');
  elements.actionResult = document.getElementById('action-result');

  if (!elements.loginForm) return; // no estamos en un entorno con el HTML adecuado

  // Si ya hay sesión, mostrar dashboard
  if (sessionStorage.getItem('demo_token')) {
    showDashboard();
  }

  // Listeners
  elements.loginForm.addEventListener('submit', onLoginSubmit);
  elements.btnClear.addEventListener('click', () => {
    elements.loginForm.reset();
    elements.usernameInput.classList.remove('is-invalid');
    elements.passwordInput.classList.remove('is-invalid');
  });

  elements.btnLogout.addEventListener('click', logout);

  const optionsList = document.getElementById('options-list');
  if (optionsList) {
    optionsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-option');
      if (!btn) return;
      const action = btn.dataset.action;
      showResult('Ejecutando acción ' + action + '...', 'info');
      setTimeout(() => {
        showResult('Acción ' + action + ' completada correctamente.', 'success');
      }, 800);
    });
  }

  // Protección básica de rutas (si alguien carga dashboard sin token)
  if (location.hash === '#dashboard' && !sessionStorage.getItem('demo_token')) {
    location.hash = '#login';
  }

  // Navegación simple por hash
  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#', '');
    if (h === 'dashboard' && sessionStorage.getItem('demo_token')) {
      showDashboard();
    }
  });
}

// Manejo del submit del formulario de login (se extrae para testeo)
function onLoginSubmit(e) {
  e.preventDefault();
  // Simple validación de campos
  if (!elements.usernameInput.value.trim()) {
    elements.usernameInput.classList.add('is-invalid');
    return;
  } else {
    elements.usernameInput.classList.remove('is-invalid');
  }

  if (!elements.passwordInput.value) {
    elements.passwordInput.classList.add('is-invalid');
    return;
  } else {
    elements.passwordInput.classList.remove('is-invalid');
  }

  // Simular autenticación
  const ok = simulateLogin(elements.usernameInput.value, elements.passwordInput.value);
  if (ok) {
    showDashboard();
  } else {
    showResult('Credenciales incorrectas. Usa usuario <strong>demo</strong> y contraseña <strong>test</strong>.', 'danger');
  }
}

// Simula la autenticación y maneja sessionStorage - utilizable en tests
function simulateLogin(username, password) {
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = 'demo-token-' + Date.now();
    sessionStorage.setItem('demo_token', token);
    sessionStorage.setItem('demo_user', JSON.stringify({ username: DEMO_USER.username, name: DEMO_USER.name }));
    return true;
  }
  return false;
}

// Mostrar dashboard y ocultar login
function showDashboard() {
  const loginSection = document.getElementById('login');
  if (loginSection) loginSection.classList.add('d-none');
  if (elements.dashboard) elements.dashboard.classList.remove('d-none');
  if (elements.navDashboardLink) elements.navDashboardLink.classList.remove('d-none');
  if (elements.navLogin) elements.navLogin.classList.add('d-none');
  const user = JSON.parse(sessionStorage.getItem('demo_user') || '{}');
  showResult('Bienvenido ' + (user.name || '') + '! Estás en el panel de pruebas.', 'success');
}

// Cerrar sesión
function logout() {
  sessionStorage.removeItem('demo_token');
  sessionStorage.removeItem('demo_user');
  // Volver a la vista de login
  const loginSection = document.getElementById('login');
  if (elements.dashboard) elements.dashboard.classList.add('d-none');
  if (loginSection) loginSection.classList.remove('d-none');
  if (elements.navDashboardLink) elements.navDashboardLink.classList.add('d-none');
  if (elements.navLogin) elements.navLogin.classList.remove('d-none');
  showResult('Sesión cerrada.');
}

// Mostrar resultado en el área designada
function showResult(message, type = 'secondary') {
  if (!elements.actionResult) return;
  elements.actionResult.innerHTML = `<div class="alert alert-${type}" role="status">${message}</div>`;
}

// Auto-inicializar en el navegador si hay window/document
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initApp);
}

// Exportar funciones para pruebas (CommonJS) para compatibilidad con Jest por defecto
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initApp, simulateLogin, logout, showResult, showDashboard, DEMO_USER };
}
