import { contextBridge, ipcRenderer } from 'electron'

// Get window type from URL parameters
const urlParams = new URLSearchParams(window.location.search)
const windowType = urlParams.get('windowType') || 'main'

contextBridge.exposeInMainWorld('electron', {
  windowType,
  onShowNoteInput: (callback: () => void) => {
    ipcRenderer.on('show-note-input', callback)
    return () => {
      ipcRenderer.removeListener('show-note-input', callback)
    }
  },
  onShowSearch: (callback: () => void) => {
    ipcRenderer.on('show-search', callback)
    return () => {
      ipcRenderer.removeListener('show-search', callback)
    }
  },
  onNotesUpdated: (callback: () => void) => {
    ipcRenderer.on('notes-updated', callback)
    return () => {
      ipcRenderer.removeListener('notes-updated', callback)
    }
  },
  onSelectNote: (callback: (note: any) => void) => {
    ipcRenderer.on('select-note', (_, note) => callback(note))
    return () => {
      ipcRenderer.removeListener('select-note', callback)
    }
  },
  saveNote: (content: string, showMain?: boolean) => ipcRenderer.invoke('save-note', content, showMain),
  getNotes: () => ipcRenderer.invoke('get-notes'),
  updateNote: (id: string, content: string) => ipcRenderer.invoke('update-note', { id, content }),
  showMainWindow: () => ipcRenderer.invoke('show-main-window'),
  hideNoteInput: () => ipcRenderer.invoke('hide-note-input')
}) 