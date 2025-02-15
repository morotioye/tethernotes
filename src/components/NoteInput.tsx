import React, { useEffect, useRef, useState } from 'react'

const NoteInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')

  // Auto focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows)
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (content.trim()) {
        try {
          await window.electron.saveNote(content)
          setContent('') // Clear the input after successful save
          if (textareaRef.current) {
            textareaRef.current.focus() // Keep focus on textarea
          }
        } catch (error) {
          console.error('Failed to save note:', error)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="h-screen w-screen p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none p-2 bg-background text-foreground focus:outline-none border-none"
          placeholder="Type your note here... (Cmd+Enter to save)"
          spellCheck="true"
        />
      </div>
    </div>
  )
}

export default NoteInput 