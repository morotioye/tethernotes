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

// Create a logger that only logs in development
/* eslint-disable no-console */
const log = {
  info: (...args: unknown[]) => isDev && console.log(...args),
  error: (...args: unknown[]) => isDev && console.error(...args)
};
/* eslint-enable no-console */

log.info('Running in development mode:', isDev);

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

  // Log the current directory and file paths
  log.info('Current directory:', __dirname);
  log.info('Preload path:', path.join(__dirname, 'preload.js'));

  if (isDev) {
    // In development, wait for the dev server to be ready
    const loadURL = async () => {
      try {
        await window.loadURL('http://localhost:5173');
        log.info('Successfully loaded dev server URL');
      } catch (err) {
        log.error('Failed to load URL:', err);
        // Retry after 1 second
        setTimeout(loadURL, 1000);
      }
    };
    loadURL();
  } else {
    // In production, load from the dist directory
    const filePath = path.join(__dirname, '../dist/index.html');
    log.info('Loading production file:', filePath);
    window.loadFile(filePath);
  }
    
  window.webContents.on('did-finish-load', () => {
    if (window) {
      window.show();
      log.info('Window loaded and shown');
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
  log.info('App is ready');
  
  app.on('activate', () => {
    log.info('Activate event triggered');
    // On macOS, show or create main window when dock icon is clicked
    if (!mainWindow) {
      log.info('Creating new main window');
      mainWindow = createWindow('main');
    } else {
      log.info('Showing existing main window');
      mainWindow.show();
    }
  });
});

// Keep the app running even when all windows are closed
app.on('window-all-closed', () => {
  log.info('All windows closed');
  // Don't quit the app when all windows are closed
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 