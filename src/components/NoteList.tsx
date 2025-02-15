import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { Settings, HelpCircle, Search, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'

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
    <div className="h-screen w-72 border-r border-border/40 bg-sidebar flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-border/40">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-8 pr-4 py-1.5 text-sm bg-background/80 border border-border/20 rounded-md 
              placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {notes.map((note) => {
            const preview = note.content.split('\n')[0].slice(0, 50) + (note.content.length > 50 ? '...' : '')
            const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
            
            return (
              <button
                key={note.id}
                onClick={() => onNoteSelect(note)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group
                  ${selectedNoteId === note.id
                    ? 'bg-accent/80 text-accent-foreground shadow-sm'
                    : 'hover:bg-accent/40 text-foreground/80 hover:text-foreground'
                  }`}
              >
                <div className="font-medium text-sm line-clamp-2">{preview}</div>
                <div className={`text-xs mt-1 transition-colors duration-200 
                  ${selectedNoteId === note.id
                    ? 'text-accent-foreground/80'
                    : 'text-muted-foreground group-hover:text-foreground/60'
                  }`}>
                  {timeAgo}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <div className="flex flex-col -space-y-1">
            <ChevronUp className="h-4 w-4" />
            <ChevronDown className="h-4 w-4" />
          </div>
          main
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 