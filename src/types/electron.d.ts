export {}

interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface IElectronAPI {
  windowType: 'main' | 'noteInput' | 'search'
  onShowNoteInput: (callback: () => void) => () => void
  onShowSearch: (callback: () => void) => () => void
  onNotesUpdated: (callback: () => void) => () => void
  onSelectNote: (callback: (note: Note) => void) => () => void
  saveNote: (content: string, showMain?: boolean) => Promise<Note>
  getNotes: () => Promise<Note[]>
  updateNote: (id: string, content: string) => Promise<Note>
  showMainWindow: () => Promise<void>
  hideNoteInput: () => void
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
} 