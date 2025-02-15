const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to copy files
function copyFiles() {
    const distRendererDir = path.join(__dirname, 'dist', 'renderer');
    const distPublicDir = path.join(distRendererDir, 'public');

    // Create directories if they don't exist
    if (!fs.existsSync(distRendererDir)) {
        fs.mkdirSync(distRendererDir, { recursive: true });
    }
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

    console.log('Files copied successfully');
}

// Initial copy
copyFiles();

// Watch for changes in HTML and CSS files
fs.watch(path.join(__dirname, 'renderer', 'index.html'), (eventType) => {
    if (eventType === 'change') {
        copyFiles();
    }
});

fs.watch(path.join(__dirname, 'renderer', 'public', 'styles.css'), (eventType) => {
    if (eventType === 'change') {
        copyFiles();
    }
}); 