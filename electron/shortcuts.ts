import { app, globalShortcut } from 'electron'

export const registerShortcuts = (mainWindow: Electron.BrowserWindow) => {
  // Register cmd+j for note creation
  globalShortcut.register('CommandOrControl+J', () => {
    mainWindow.webContents.send('show-note-input')
  })

  // Register cmd+k for search
  globalShortcut.register('CommandOrControl+K', () => {
    mainWindow.webContents.send('show-search')
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
} 