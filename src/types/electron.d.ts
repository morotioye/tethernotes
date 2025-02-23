export {}

export interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  spaceId: string
}

interface Space {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface ElectronAPI {
  windowType: string
  onShowNoteInput: (callback: () => void) => () => void
  onShowSearch: (callback: () => void) => () => void
  onNotesUpdated: (callback: () => void) => () => void
  onSelectNote: (callback: (note: Note) => void) => () => void
  saveNote: (content: string, showMain?: boolean, space?: string) => Promise<Note>
  getNotes: () => Promise<Note[]>
  updateNote: (id: string, content: string) => Promise<Note>
  deleteNote: (id: string) => Promise<void>
  createSpace: (data: { name: string; description?: string }) => Promise<Space>
  getSpaces: () => Promise<Space[]>
  showMainWindow: () => Promise<void>
  hideNoteInput: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
} 