import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Signale } from 'signale';
// We'll use registerShortcuts later when implementing shortcuts
// import { registerShortcuts } from './shortcuts';

// Configure logger
const logger = new Signale({
  types: {
    start: {
      badge: '🚀',
      color: 'green',
      label: 'start',
      logLevel: 'info'
    },
    save: {
      badge: '💾',
      color: 'blue',
      label: 'save',
      logLevel: 'info'
    },
    update: {
      badge: '📝',
      color: 'yellow',
      label: 'update',
      logLevel: 'info'
    }
  }
});

// Enable secure coding for macOS
if (process.platform === 'darwin') {
  // @ts-ignore - This property exists but TypeScript doesn't know about it
  app.applicationSupportsSecureRestorableState = true;
}

// Enable hot reloading in development
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reloader')(module, {
      debug: false, // Disable debug logs
      watchRenderer: false
    });
  } catch (_) { /* ignore */ }
}

// Initialize Prisma
const prisma = new PrismaClient({
  log: [] // Disable Prisma logs
});

// Window references
let mainWindow: BrowserWindow | null = null;
let noteInputWindow: BrowserWindow | null = null;
// We'll use these windows later when implementing their functionality
// let searchWindow: BrowserWindow | null = null;

// Explicitly set development mode
const isDev = process.env.NODE_ENV === 'development';

// Handle showing main window
ipcMain.handle('show-main-window', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createWindow('main');
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
});

// Handle note saving
ipcMain.handle('save-note', async (_, content: string, showMain: boolean = false) => {
  try {
    const note = await prisma.note.create({
      data: {
        content
      } as any // Temporary type assertion to fix the issue
    });
    if (noteInputWindow) {
      noteInputWindow.hide();
    }
    // Only notify main window if it's already open
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) {
      mainWindow.webContents.send('notes-updated');
    }
    if (showMain) {
      if (!mainWindow || mainWindow.isDestroyed()) {
        mainWindow = createWindow('main');
        // Wait for the window to load before sending the note
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow?.webContents.send('select-note', note);
        });
      } else {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('select-note', note);
      }
    }
    logger.save(`Note saved: ${content.slice(0, 30)}${content.length > 30 ? '...' : ''}`);
    return note;
  } catch (error) {
    logger.error('Failed to save note:', error);
    throw error;
  }
});

// Handle getting notes
ipcMain.handle('get-notes', async () => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    logger.update(`Fetched ${notes.length} notes`);
    return notes;
  } catch (error) {
    logger.error('Failed to fetch notes:', error);
    throw error;
  }
});

// Handle updating notes
ipcMain.handle('update-note', async (_, { id, content }: { id: string; content: string }) => {
  try {
    const note = await prisma.note.update({
      where: { id },
      data: { content }
    });
    logger.update(`Note updated: ${content.slice(0, 30)}${content.length > 30 ? '...' : ''}`);
    return note;
  } catch (error) {
    logger.error('Failed to update note:', error);
    throw error;
  }
});

const createWindow = (windowType: 'main' | 'noteInput' | 'search'): BrowserWindow => {
  const window = new BrowserWindow({
    width: windowType === 'main' ? 1200 : 800,
    height: windowType === 'main' ? 800 : 400,
    backgroundColor: '#ffffff',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false // Required for Prisma to work
    },
    frame: false,
    show: false, // Don't show the window until it's ready
    alwaysOnTop: windowType === 'noteInput',
    center: true,
  });

  if (isDev) {
    // In development, wait for the dev server to be ready
    const loadURL = async () => {
      try {
        await window.loadURL(`http://localhost:5173?windowType=${windowType}`);
      } catch (err) {
        // Retry after 1 second
        setTimeout(loadURL, 1000);
      }
    };
    loadURL();
  } else {
    // In production, load from the dist directory
    const filePath = path.join(__dirname, '../dist/index.html');
    window.loadFile(filePath, { query: { windowType } });
  }
    
  window.webContents.on('did-finish-load', () => {
    if (window) {
      window.show();
      if (windowType === 'main') {
        logger.start('Main window ready 🎉');
      }
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
  logger.start('Starting TetherNotes 📝');
  // Register global shortcuts
  globalShortcut.register('CommandOrControl+J', toggleNoteInput);
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      mainWindow = createWindow('main');
    }
  });

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