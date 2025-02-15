import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { registerShortcuts } from './shortcuts';

// Window references
let mainWindow: BrowserWindow | null = null;
let noteInputWindow: BrowserWindow | null = null;
let searchWindow: BrowserWindow | null = null;

// Explicitly set development mode
const isDev = process.env.NODE_ENV === 'development';
console.log('Running in development mode:', isDev);

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
  console.log('Current directory:', __dirname);
  console.log('Preload path:', path.join(__dirname, 'preload.js'));

  if (isDev) {
    // In development, wait for the dev server to be ready
    const loadURL = async () => {
      try {
        await window.loadURL('http://localhost:5173');
        console.log('Successfully loaded dev server URL');
      } catch (err) {
        console.error('Failed to load URL:', err);
        // Retry after 1 second
        setTimeout(loadURL, 1000);
      }
    };
    loadURL();
  } else {
    // In production, load from the dist directory
    const filePath = path.join(__dirname, '../dist/index.html');
    console.log('Loading production file:', filePath);
    window.loadFile(filePath);
  }
    
  window.webContents.on('did-finish-load', () => {
    if (window) {
      window.show();
      console.log('Window loaded and shown');
    }
  });

  // For development
  if (isDev) {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  // Handle window closing
  window.on('closed', () => {
    switch (windowType) {
      case 'main':
        mainWindow = null;
        break;
      case 'noteInput':
        noteInputWindow = null;
        break;
      case 'search':
        searchWindow = null;
        break;
    }
  });

  return window;
};

// Create window when app is ready - but don't show any window initially
app.whenReady().then(() => {
  console.log('App is ready');
  // We'll initialize shortcuts here later
  
  app.on('activate', () => {
    console.log('Activate event triggered');
    // On macOS, show or create main window when dock icon is clicked
    if (!mainWindow) {
      console.log('Creating new main window');
      mainWindow = createWindow('main');
    } else {
      console.log('Showing existing main window');
      mainWindow.show();
    }
  });
});

// Keep the app running even when all windows are closed
app.on('window-all-closed', () => {
  console.log('All windows closed');
  // Don't quit the app when all windows are closed
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 