import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
// We'll use registerShortcuts later when implementing shortcuts
// import { registerShortcuts } from './shortcuts';

// Window references
let mainWindow: BrowserWindow | null = null;
// We'll use these windows later when implementing their functionality
// let noteInputWindow: BrowserWindow | null = null;
// let searchWindow: BrowserWindow | null = null;

// Explicitly set development mode
const isDev = process.env.NODE_ENV === 'development';

const createWindow = (windowType: 'main' | 'noteInput' | 'search'): BrowserWindow => {
  const window = new BrowserWindow({
    width: windowType === 'main' ? 1200 : 600,
    height: windowType === 'main' ? 800 : 400,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false // Required for Prisma to work
    },
    frame: true, // Enable frame for now for debugging
    show: false, // Don't show the window until it's ready
  });

  if (isDev) {
    // In development, wait for the dev server to be ready
    const loadURL = async () => {
      try {
        await window.loadURL('http://localhost:5173');
      } catch (err) {
        // Retry after 1 second
        setTimeout(loadURL, 1000);
      }
    };
    loadURL();
  } else {
    // In production, load from the dist directory
    const filePath = path.join(__dirname, '../dist/index.html');
    window.loadFile(filePath);
  }
    
  window.webContents.on('did-finish-load', () => {
    if (window) {
      window.show();
    }
  });

  // For development
  if (isDev) {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  // Handle window closing
  window.on('closed', () => {
    if (windowType === 'main') {
      mainWindow = null;
    }
  });

  return window;
};

// Create window when app is ready - but don't show any window initially
app.whenReady().then(() => {
  app.on('activate', () => {
    // On macOS, show or create main window when dock icon is clicked
    if (!mainWindow) {
      mainWindow = createWindow('main');
    } else {
      mainWindow.show();
    }
  });
});

// Keep the app running even when all windows are closed
app.on('window-all-closed', () => {
  // Don't quit the app when all windows are closed
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 