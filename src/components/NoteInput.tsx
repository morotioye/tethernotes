import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'

const NoteInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')

  // Auto focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleSave = async (showMain: boolean = false) => {
    const content = textareaRef.current?.value.trim()
    if (content) {
      try {
        await window.electron.saveNote(content, showMain)
        if (textareaRef.current) {
          textareaRef.current.value = ''
        }
      } catch (error) {
        console.error('Failed to save note:', error)
      }
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (e.shiftKey) {
        await handleSave(true)
      } else {
        await handleSave()
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="h-[20vh]" />
      <div className="w-full max-w-3xl bg-sidebar/50 rounded-lg shadow-lg flex flex-col mx-6 border border-border/10">
        {/* Main textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full resize-none p-4 bg-transparent text-foreground focus:outline-none border-none text-lg min-h-[180px] max-h-[180px]"
          placeholder="Type your note here... (Cmd+Enter to save)"
          spellCheck="true"
        />

        {/* Footer */}
        <div className="px-6 py-3 flex items-center justify-between bg-sidebar/50 rounded-b-lg">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            inbox
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Capture
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NoteInput 