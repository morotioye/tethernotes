import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
// We'll use registerShortcuts later when implementing shortcuts
// import { registerShortcuts } from './shortcuts';

// Window references
let mainWindow: BrowserWindow | null = null;
let noteInputWindow: BrowserWindow | null = null;
// We'll use these windows later when implementing their functionality
// let searchWindow: BrowserWindow | null = null;

// Explicitly set development mode
const isDev = process.env.NODE_ENV === 'development';

const createWindow = (windowType: 'main' | 'noteInput' | 'search'): BrowserWindow => {
  const window = new BrowserWindow({
    width: windowType === 'main' ? 1200 : 600,
    height: windowType === 'main' ? 800 : 200,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false // Required for Prisma to work
    },
    frame: windowType === 'main',
    show: false, // Don't show the window until it's ready
    alwaysOnTop: windowType === 'noteInput',
    center: true,
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

  // Handle window closing
  window.on('closed', () => {
    if (windowType === 'main') {
      mainWindow = null;
    } else if (windowType === 'noteInput') {
      noteInputWindow = null;
    }
  });

  // For note input window, hide instead of close when pressing escape
  if (windowType === 'noteInput') {
    window.on('blur', () => {
      window.hide();
    });
  }

  return window;
};

const toggleNoteInput = () => {
  if (noteInputWindow && !noteInputWindow.isDestroyed()) {
    if (noteInputWindow.isVisible()) {
      noteInputWindow.hide();
    } else {
      noteInputWindow.show();
      noteInputWindow.focus();
    }
  } else {
    noteInputWindow = createWindow('noteInput');
  }
};

// Create window when app is ready - but don't show any window initially
app.whenReady().then(() => {
  // Register global shortcut
  globalShortcut.register('CommandOrControl+J', toggleNoteInput);

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