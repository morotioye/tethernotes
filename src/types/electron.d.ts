export {}

declare global {
  interface Window {
    electron: {
      windowType: 'main' | 'noteInput' | 'search'
      onShowNoteInput: (callback: () => void) => () => void
      onShowSearch: (callback: () => void) => () => void
      onNotesUpdated: (callback: () => void) => () => void
      saveNote: (content: string) => Promise<void>
      getNotes: () => Promise<Array<{
        id: string
        content: string
        createdAt: Date
        updatedAt: Date
      }>>
      updateNote: (id: string, content: string) => Promise<{
        id: string
        content: string
        createdAt: Date
        updatedAt: Date
      }>
    }
  }
} 