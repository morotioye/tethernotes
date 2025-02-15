import { contextBridge, ipcRenderer } from 'electron'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

contextBridge.exposeInMainWorld('electron', {
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
  prisma: prisma
}) 