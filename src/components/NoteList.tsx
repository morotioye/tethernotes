import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'

export type Note = {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface NoteListProps {
  notes: Note[]
  selectedNoteId: string | null
  onNoteSelect: (note: Note) => void
}

export function NoteList({ notes, selectedNoteId, onNoteSelect }: NoteListProps) {
  return (
    <ScrollArea className="h-screen w-64 border-r">
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4">Notes</h2>
        {notes.map((note) => {
          const preview = note.content.split('\n')[0].slice(0, 50) + (note.content.length > 50 ? '...' : '')
          return (
            <button
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedNoteId === note.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="font-medium">{preview}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </div>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
} 