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

## Publicar manualmente desde GitHub

Se incluyó un workflow manual para construir y publicar en GitHub Pages:

- Archivo: `.github/workflows/manual-deploy.yml`
- Uso: en GitHub, ve a la pestaña Actions -> "Manual Build & Publish to GitHub Pages" -> Run workflow.
- El workflow hace `npm ci`, intenta ejecutar `npm run build` si existe, y empaqueta archivos estáticos.
- Si eliges publicar, el workflow sube y despliega el contenido a GitHub Pages.

Notas de seguridad:
- Asegúrate de no tener secretos en el repositorio antes de publicar.
- Para despliegues privados o a otros destinos (Azure, S3, FTP) añade los secrets en GitHub (Settings -> Secrets).

### Generar el build localmente

1. En tu máquina local (PowerShell), sitúate en la carpeta del proyecto:

```powershell
cd 'c:\Users\Hades\Desktop\Actividad Número 4'
```

2. Instala dependencias si no lo has hecho aún:

```powershell
npm install
```

3. Genera el build con el script incluido:

```powershell
npm run build
```

Esto creará la carpeta `build/` con los archivos listos para publicar (index.html, css/, js/, README.md).

### Opciones para publicar manualmente en GitHub Pages

Opción A — Publicar empujando `build/` a la rama `gh-pages` (manual, sin herramientas extra):

1. Asegúrate de tener los últimos cambios en `main`:

```powershell
git checkout main
git pull origin main
```

2. Genera el build localmente: `npm run build`.

3. Crear y empujar la rama `gh-pages` con el contenido de `build/`:

```powershell
# Crea (o cambia a) la rama gh-pages
git checkout --orphan gh-pages

# Elimina todos los archivos del índice
git rm -rf --cached .

# Copia los archivos del build al root del repo (PowerShell)
Copy-Item -Path .\build\* -Destination . -Recurse -Force

git add .
git commit -m "Publicar sitio - build"
git push -u origin gh-pages --force
```

4. En GitHub -> Settings -> Pages configura la fuente a `gh-pages` branch y la carpeta `/ (root)`.

Opción B — Usar el paquete `gh-pages` (recomendado, automatiza la publicación):

1. Instala `gh-pages` localmente (una sola vez):

```powershell
npm install --save-dev gh-pages
```

2. Añade un script en `package.json` bajo `scripts` (opcional):

```json
"deploy": "gh-pages -d build"
```

3. Ejecuta:

```powershell
npm run build
npm run deploy
```

Esto publicará el contenido de `build/` en la rama `gh-pages` automáticamente.

Opción C — Usar el workflow manual en GitHub (si prefieres ejecutar en Actions pero generar build localmente)

1. Genera `build/` localmente: `npm run build`.
2. Añade y commitea `build/` en una rama (por ejemplo `deploy-build`) y púshala al repo.
3. Ejecuta el workflow `Manual Build & Publish to GitHub Pages` desde la pestaña Actions en GitHub y configura el workflow para usar los artefactos subidos si es necesario.

Notas finales

- Después de publicar, la URL de GitHub Pages estará en la página Settings -> Pages del repositorio.
- Para repos privados la publicación en GitHub Pages puede requerir configuración adicional (org settings). Si quieres, puedo añadir un script `deploy` que use `gh-pages` y actualizar `package.json` para hacerlo aún más sencillo.

## Guía: Pipeline automatizado CI/CD en GitHub (Tests · Audit · Build · Deploy)

Esta guía explica cómo funciona el pipeline automatizado que ya está incluido en este repositorio mediante GitHub Actions, qué necesita configurarse en GitHub y cómo validar el despliegue en el entorno de pruebas.

Resumen de la pipeline incluida
- Archivo workflow: `.github/workflows/ci.yml`
- Jobs (orden):
  1. `test-and-audit`: instala dependencias, ejecuta `npm test` y `npm audit` (genera `audit.json`). Si se detectan vulnerabilidades HIGH/CRITICAL la job falla.
  2. `build`: ejecuta `npm run build` (si existe) o empaqueta archivos estáticos en `deploy/`, crea un ZIP y lo sube como artifact.
  3. `deploy`: despliega el contenido al environment `pruebas` usando GitHub Pages actions (puede ajustarse a otros destinos).

Requisitos previos (antes de activar la pipeline)
1. Tener el repo en GitHub (preferible rama `main`).
2. Revisar `package.json` y confirmar que existe el script `build`. Este repo incluye un script `build` mínimo que copia archivos a `build/`:

```json
"scripts": {
  "build": "node scripts/build.js",
  "test": "jest --coverage",
  "start": "npx http-server . -p 8090"
}
```

3. Si vas a desplegar a GitHub Pages:
  - En el repositorio ve a Settings → Pages y configura la fuente si quieres usar `gh-pages` o ramas específicas. El workflow usa las actions oficiales para publicar.

4. Crear el Environment `pruebas` en GitHub (opcional pero recomendado):
  - Ve a Settings → Environments → New environment → nombre `pruebas`.
  - Si quieres aprobación manual antes de deploy, añade reviewers en la protección del environment. El job `deploy` en el workflow declara `environment: pruebas`, por lo que respetará estas protecciones.

5. (Opcional) Secrets y permisos:
  - Para despliegues a otros destinos (Azure App Service, S3, FTP, Netlify) crea secrets en Settings → Secrets and variables → Actions (ej: `AZURE_WEBAPP_PUBLISH_PROFILE`, `NETLIFY_AUTH_TOKEN`, `FTP_PASSWORD`).
  - Si el destino no es GitHub Pages, modifica el job `deploy` para usar la acción correspondiente e inyectar los secrets.

Cómo funciona el flujo (ejecución automática)
1. Cada push a `main` o cada Pull Request hacia `main` ejecuta el workflow (`on: push, pull_request`).
2. `test-and-audit` corre primero. Si falla (tests o vulnerabilities HIGH/CRITICAL) la pipeline se detiene y no pasa al build.
3. Si `test-and-audit` pasa, `build` empaqueta el sitio y sube el artifact.
4. `deploy` toma el artifact y publica al environment `pruebas` (actualmente usa GitHub Pages). Si el environment tiene protección con reviewers, GitHub solicitará aprobación manual antes de ejecutar el deploy.

Cómo validar todo paso a paso
1. Habilita Actions en el repo si está deshabilitado. Asegúrate de que GitHub Actions tenga permisos para ejecutar workflows.
2. Crea o actualiza la rama `main` con los cambios y pushea:

```powershell
git checkout main
git add .
git commit -m "Trigger CI: pruebas, audit, build, deploy"
git push origin main
```

3. Ver logs: Ve a la pestaña Actions → selecciona el workflow `GitHub CI/CD - Tests · Audit · Build · Deploy` → revisa la ejecución y los logs por job.
4. Artefactos: en la página de ejecución puedes encontrar los artefactos (audit-report y webapp-artifact) y descargarlos para inspección.
5. Deployment: si el deploy se completó, revisa la página de GitHub Pages (Settings → Pages) para la URL o la sección Environments → `pruebas` para ver el estado y aprobaciones.

Recomendaciones prácticas y seguridad
- No almacenes secrets o credenciales en el repo. Usa GitHub Secrets.
- Si la ejecución en PRs es costosa, considera limitar audit o E2E a `push` en `main` y dejar tests unitarios en PRs.
- Si vas a ejecutar muchas builds, usa runners self-hosted para reducir coste en minutos del plan.

Modificar el destino de despliegue (ejemplos rápidos)
- Azure App Service: usa `azure/webapps-deploy@v2` y el secret `AZURE_WEBAPP_PUBLISH_PROFILE`.
- Netlify: usa `netlify/actions/cli` o `netlify/actions/deploy` y el secret `NETLIFY_AUTH_TOKEN`.
- S3: usa `jakejarvis/s3-sync-action` y secrets `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`.

¿Quieres que adapte el job `deploy` a uno de esos destinos (p. ej. Azure App Service)? Si me indicas el destino y si ya tienes los secrets, lo implemento y pruebas.

---

Comentarios en español incluidos en los archivos fuente para facilitar la lectura y personalización.