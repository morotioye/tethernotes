import React, { useEffect, useState } from 'react'
import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'
import NoteInput from './components/NoteInput'
import { NoteList, type Note } from './components/NoteList'
import { NoteEditor } from './components/NoteEditor'

export default function App() {
  const windowType = window.electron?.windowType || 'main'
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const loadNotes = async () => {
    try {
      const loadedNotes = await window.electron.getNotes()
      setNotes(loadedNotes)
    } catch (error) {
      console.error('Failed to load notes:', error)
    }
  }

  // Load notes on mount and set up note update listener
  useEffect(() => {
    if (windowType === 'main') {
      loadNotes()

      // Listen for note updates
      const updateCleanup = window.electron.onNotesUpdated(() => {
        loadNotes()
      })

      // Listen for note selection
      const selectCleanup = window.electron.onSelectNote((note) => {
        setSelectedNote(note)
      })

      return () => {
        updateCleanup()
        selectCleanup()
      }
    }
  }, [windowType])

  const handleSaveNote = async (content: string) => {
    try {
      if (selectedNote) {
        // Update existing note
        const updatedNote = await window.electron.updateNote(selectedNote.id, content)
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
        setSelectedNote(updatedNote)
      }
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      {windowType === 'noteInput' ? (
        <NoteInput />
      ) : (
        <div className="h-screen w-screen flex bg-background text-foreground">
          <NoteList
            notes={notes}
            selectedNoteId={selectedNote?.id || null}
            onNoteSelect={setSelectedNote}
          />
          <div className="flex-1 flex flex-col">
            <div className="flex justify-end p-4">
              <ThemeToggle />
            </div>
            <div className="flex-1">
              <NoteEditor note={selectedNote} onSave={handleSaveNote} />
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  )
} 