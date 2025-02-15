import React, { useEffect, useRef, useState } from 'react'
import type { Note } from './NoteList'

interface NoteEditorProps {
  note: Note | null
  onSave: (content: string) => Promise<void>
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setContent(note.content)
    }
  }, [note?.id, note?.content])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [note?.id])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (content.trim() && note) {
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
    <div className="h-full flex justify-center">
      <div className="w-full max-w-3xl px-16">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none pt-32 pb-8 bg-background text-foreground focus:outline-none border-none"
          placeholder="Type your note here... (Cmd+Enter to save)"
          spellCheck="true"
        />
      </div>
    </div>
  )
} 