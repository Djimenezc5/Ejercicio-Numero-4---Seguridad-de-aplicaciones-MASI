const fs = require('fs');
const path = require('path');

describe('App frontend - pruebas básicas', () => {
  let app;

  beforeEach(() => {
    // Cargar el HTML de la aplicación en el DOM de jsdom
    const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // Importar el módulo después de que el DOM exista
    app = require('../js/app');
    if (app && app.initApp) app.initApp();
  });

  afterEach(() => {
    // Limpiar sessionStorage y resetear el require cache
    sessionStorage.clear();
    jest.resetModules();
  });

  test('login con credenciales correctas debe crear token y mostrar dashboard', () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const form = document.getElementById('login-form');

    username.value = 'demo';
    password.value = 'test';

    // Enviar el formulario
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(sessionStorage.getItem('demo_token')).toBeTruthy();
    const dashboard = document.getElementById('dashboard');
    expect(dashboard.classList.contains('d-none')).toBe(false);
  });

  test('login con credenciales incorrectas muestra mensaje de error', () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const form = document.getElementById('login-form');

    username.value = 'wrong';
    password.value = 'bad';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const actionResult = document.getElementById('action-result');
    expect(actionResult.innerHTML).toMatch(/Credenciales incorrectas/i);
    expect(sessionStorage.getItem('demo_token')).toBeNull();
  });

  test('logout limpia la sesión y vuelve a la vista de login', () => {
    // Primero iniciar sesión por medio de la función simulateLogin
    const ok = app.simulateLogin('demo', 'test');
    expect(ok).toBe(true);
    expect(sessionStorage.getItem('demo_token')).toBeTruthy();

    // Inicializar la app para que tome los elementos y luego llamar logout
    if (app && app.logout) app.logout();

    expect(sessionStorage.getItem('demo_token')).toBeNull();
    const loginSection = document.getElementById('login');
    expect(loginSection.classList.contains('d-none')).toBe(false);
  });
});
