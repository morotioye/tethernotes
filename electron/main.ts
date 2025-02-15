import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { registerShortcuts } from './shortcuts';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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

  // Set NODE_ENV to development
  process.env.NODE_ENV = 'development';

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173').catch((err) => {
      console.error('Failed to load URL:', err);
    });
    
    // Open DevTools and dock it to the right
    mainWindow.webContents.openDevTools({ mode: 'right' });
    
    mainWindow.webContents.on('dom-ready', () => {
      console.log('DOM is ready');
    });
    
    mainWindow.webContents.on('did-start-loading', () => {
      console.log('Started loading content');
    });
    
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Finished loading content');
      if (mainWindow) {
        mainWindow.show();
      }
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  if (mainWindow) {
    registerShortcuts(mainWindow);
  }

  // Handle window closing
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Log any load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
};

// Create window when app is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 