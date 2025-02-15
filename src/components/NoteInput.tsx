import React, { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import toast from 'react-hot-toast'

export function NoteInput() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const cleanup = window.electron.onShowNoteInput(() => {
      setOpen(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    })

    return cleanup
  }, [])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.metaKey && e.key === 'Enter') {
      const content = inputRef.current?.value
      if (!content) return

      try {
        await window.electron.prisma.note.create({
          data: {
            content,
          },
        })
        toast.success('Note saved')
        setOpen(false)
        if (inputRef.current) {
          inputRef.current.value = ''
        }
      } catch (error) {
        toast.error('Failed to save note')
        console.error('Failed to save note:', error)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/4 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-4">
            <textarea
              ref={inputRef}
              className="w-full h-24 p-2 text-black bg-white border-none resize-none focus:outline-none focus:ring-0 placeholder:text-gray-400 text-base leading-relaxed"
              placeholder="What's on your mind? (⌘+Enter to save)"
              onKeyDown={handleKeyDown}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 