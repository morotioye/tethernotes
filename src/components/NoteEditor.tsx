import React, { useEffect, useRef } from 'react'
import type { Note } from './NoteList'

interface NoteEditorProps {
  note: Note | null
  onSave: (content: string) => Promise<void>
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [note?.id])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      const content = textareaRef.current?.value.trim()
      if (content && note) {
        try {
          await onSave(content)
        } catch (error) {
          console.error('Failed to save note:', error)
        }
      }
    }
  }

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a note to edit
      </div>
    )
  }

  return (
    <div className="h-full p-4">
      <textarea
        ref={textareaRef}
        defaultValue={note.content}
        onKeyDown={handleKeyDown}
        className="w-full h-full resize-none p-2 bg-background text-foreground focus:outline-none border-none"
        placeholder="Type your note here... (Cmd+Enter to save)"
        spellCheck="true"
      />
    </div>
  )
} 