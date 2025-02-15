const fs = require('fs');
const path = require('path');

// Create dist/renderer directory if it doesn't exist
const distRendererDir = path.join(__dirname, 'dist', 'renderer');
if (!fs.existsSync(distRendererDir)) {
    fs.mkdirSync(distRendererDir, { recursive: true });
}

// Create dist/renderer/public directory if it doesn't exist
const distPublicDir = path.join(distRendererDir, 'public');
if (!fs.existsSync(distPublicDir)) {
    fs.mkdirSync(distPublicDir, { recursive: true });
}

// Copy HTML file
fs.copyFileSync(
    path.join(__dirname, 'renderer', 'index.html'),
    path.join(distRendererDir, 'index.html')
);

// Copy CSS file
fs.copyFileSync(
    path.join(__dirname, 'renderer', 'public', 'styles.css'),
    path.join(distPublicDir, 'styles.css')
); 