import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import type { Note } from '@prisma/client'

export function Search() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const cleanup = window.electron.onShowSearch(() => {
      setOpen(true)
    })

    return cleanup
  }, [])

  useEffect(() => {
    if (!open) return
    
    const searchNotes = async () => {
      try {
        const results = await window.electron.prisma.note.findMany({
          where: {
            content: {
              contains: search,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        setNotes(results)
      } catch (error) {
        console.error('Failed to search notes:', error)
      }
    }

    searchNotes()
  }, [search, open])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/4 w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Command className="w-full" shouldFilter={false}>
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search notes..."
              className="w-full px-4 h-12 outline-none bg-white text-black border-b border-gray-200 placeholder:text-gray-400"
            />
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="p-4 text-sm text-gray-500">
                No results found.
              </Command.Empty>
              {notes.map((note) => (
                <Command.Item
                  key={note.id}
                  className="w-full p-2 rounded-md text-left text-black hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-sm">{note.content}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 