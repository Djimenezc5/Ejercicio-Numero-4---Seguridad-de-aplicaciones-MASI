// Script de build minimal para el proyecto estático
// Copia archivos necesarios a la carpeta `build/` para publicarlos en GitHub Pages.

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const buildDir = path.join(projectRoot, 'build');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Limpia build dir
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

// Archivos/dirs a incluir en el build. Ajusta según tu estructura.
const includes = [
  'index.html',
  'css',
  'js',
  'README.md'
];

for (const item of includes) {
  const src = path.join(projectRoot, item);
  if (fs.existsSync(src)) {
    const dest = path.join(buildDir, item);
    copyRecursive(src, dest);
    console.log('Copiado:', item);
  } else {
    console.log('No existe (se omite):', item);
  }
}

console.log('\nBuild generado en:', buildDir);
