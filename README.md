# Demo: Proyecto Frontend (HTML + JS + Bootstrap)

Proyecto de ejemplo para simular una página con login y un panel de opciones. Pensado para un entorno de pruebas.

## Estructura

- `index.html` - Página principal con formulario de login y panel de opciones.
- `css/styles.css` - Estilos personalizados mínimos.
- `js/app.js` - Lógica del frontend; login simulado y manejo de sesión en `sessionStorage`.
- `package.json` - Script para levantar un servidor de pruebas con `npx http-server`.
- `.gitignore` - Archivos/dirs a ignorar.

Bootstrap está incluido mediante CDN en `index.html` (CSS + JS bundle) y también se incluyen los Bootstrap Icons para facilitar el estilo de iconos. Si prefieres instalar Bootstrap localmente para pruebas, puedes hacerlo con npm (ver sección siguiente).

## Requisitos

- Node.js (opcional, sólo si quieres usar `npx http-server`).

## Ejecutar en ambiente de pruebas (local)

Usa PowerShell en Windows (desde la carpeta del proyecto):

```powershell
# Levantar un servidor estático en el puerto 8080 (sin instalar paquetes globales)
npx http-server . -p 8080

# Luego abre en el navegador:
# http://localhost:8080
```

El proyecto está pensado sólo para pruebas y demostraciones. Las credenciales de prueba son:

- Usuario: `demo`
- Contraseña: `test`

## Consideraciones para publicar en un entorno de pruebas

- Asegúrate de que el servidor devuelvan cabeceras para deshabilitar cache si no quieres caché en pruebas (ej: `Cache-Control: no-store`).
- `index.html` incluye `<meta name="robots" content="noindex,nofollow">` para evitar indexación en entornos de prueba.
- Si subes a GitHub Pages o Netlify, revisa que los assets (css/js) estén en las rutas correctas.
- No guardar credenciales reales en el frontend. Aquí sólo se usa `sessionStorage` y tokens simulados para demo.

## Instalar Bootstrap localmente (opcional)

Si quieres trabajar sin CDN o realizar builds locales, puedes instalar Bootstrap y Bootstrap Icons con npm:

```powershell
npm install bootstrap bootstrap-icons --save
```

Luego ajusta las referencias en `index.html` a los archivos locales (por ejemplo `node_modules/bootstrap/dist/css/bootstrap.min.css`).

## Seguridad y producción

- Este proyecto NO está preparado para producción. Falta:
  - Backend seguro para autenticación (OAuth/JWT, hashing de contraseñas, TLS).
  - Protección CSRF, rate limiting, auditorías de seguridad.
  - Validaciones server-side y sanitización.

## Accesibilidad

- Formularios con `aria-*` básicos y roles en las alertas (`aria-live="polite"`).
- Preferir contraste y estados de foco visibles (ya incluidos en `css/styles.css`).

## Próximos pasos (sugeridos)

- Añadir backend simulado (Express) para autenticar en ambiente de pruebas.
- Añadir tests automatizados (jest/puppeteer) para flujos de login.
- Añadir pipeline de CI para desplegar en un entorno de staging.

---

Comentarios en español incluidos en los archivos fuente para facilitar la lectura y personalización.