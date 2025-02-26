import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import type { Note } from '../src/types/electron'

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
  onSelectNote: (callback: (note: Note) => void) => {
    const handler = (_event: IpcRendererEvent, note: Note) => callback(note)
    ipcRenderer.on('select-note', handler)
    return () => {
      ipcRenderer.removeListener('select-note', handler)
    }
  },
  saveNote: (content: string, showMain?: boolean, space?: string) => ipcRenderer.invoke('save-note', content, showMain, space),
  getNotes: () => ipcRenderer.invoke('get-notes'),
  updateNote: (id: string, content: string) => ipcRenderer.invoke('update-note', { id, content }),
  deleteNote: (id: string) => ipcRenderer.invoke('delete-note', id),
  createSpace: (data: { name: string; description?: string }) => ipcRenderer.invoke('create-space', data),
  getSpaces: () => ipcRenderer.invoke('get-spaces'),
  showMainWindow: () => ipcRenderer.invoke('show-main-window'),
  hideNoteInput: () => ipcRenderer.invoke('hide-note-input')
}) 