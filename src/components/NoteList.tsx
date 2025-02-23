import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { Settings, HelpCircle, Search, Folders, Plus, Trash2, Copy, Share, Edit } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from './ui/context-menu'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog'

export type Note = {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  spaceId: string
}

interface Space {
  id: string
  name: string
  description?: string
}

interface NoteListProps {
  notes: Note[]
  selectedNoteId: string | null
  onNoteSelect: (note: Note) => void
}

export function NoteList({ notes, selectedNoteId, onNoteSelect }: NoteListProps) {
  const [showSpaceMenu, setShowSpaceMenu] = useState(false)
  const spaceMenuRef = useRef<HTMLDivElement>(null)
  const [currentSpaceId, setCurrentSpaceId] = useState('inbox')
  const [currentSpaceName, setCurrentSpaceName] = useState('inbox')
  const [spaces, setSpaces] = useState<Space[]>([])
  const [showNewSpaceDialog, setShowNewSpaceDialog] = useState(false)
  const [newSpaceName, setNewSpaceName] = useState('')
  const [newSpaceDescription, setNewSpaceDescription] = useState('')
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [dontAskAgain, setDontAskAgain] = useState(false)

  useEffect(() => {
    fetchSpaces()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (spaceMenuRef.current && !spaceMenuRef.current.contains(event.target as Node)) {
        setShowSpaceMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSpaces = async () => {
    try {
      const spaces = await window.electron.getSpaces()
      setSpaces(spaces)
    } catch (error) {
      console.error('Failed to fetch spaces:', error)
    }
  }

  // Filter notes by current space
  const filteredNotes = notes.filter(note => note.spaceId === currentSpaceId)

  const handleCreateSpace = async () => {
    if (newSpaceName.trim()) {
      try {
        const newSpace = await window.electron.createSpace({
          name: newSpaceName.trim().toLowerCase(),
          description: newSpaceDescription.trim() || undefined
        })
        setNewSpaceName('')
        setNewSpaceDescription('')
        setShowNewSpaceDialog(false)
        await fetchSpaces()
        setCurrentSpaceId(newSpace.id)
        setCurrentSpaceName(newSpace.name)
      } catch (error) {
        console.error('Failed to create space:', error)
      }
    }
  }

  const handleDeleteNote = async (note: Note) => {
    try {
      await window.electron.deleteNote(note.id)
      setNoteToDelete(null)
      setShowDeleteConfirm(false)
      // Refresh the notes list by calling getNotes and updating the parent component
      const notes = await window.electron.getNotes()
      onNoteSelect(notes[0] || null) // Select first note or null if no notes remain
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const handleNoteContextMenu = (note: Note) => {
    if (dontAskAgain) {
      handleDeleteNote(note)
    } else {
      setNoteToDelete(note)
      setShowDeleteConfirm(true)
    }
  }

  return (
    <>
      <div className="h-screen w-72 border-r border-border/40 bg-sidebar flex flex-col">
        {/* Drag Region */}
        <div className="h-8 app-region-drag" />
        
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
            {filteredNotes.map((note) => {
              const preview = note.content.split('\n')[0].slice(0, 50) + (note.content.length > 50 ? '...' : '')
              const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
              
              return (
                <ContextMenu key={note.id}>
                  <ContextMenuTrigger asChild>
                    <button
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
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onSelect={() => onNoteSelect(note)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onSelect={() => handleNoteContextMenu(note)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border/40 flex items-center justify-between">
          <div className="relative" ref={spaceMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowSpaceMenu(!showSpaceMenu)}
            >
              <Folders className="h-4 w-4" />
              {currentSpaceName}
            </Button>

            {showSpaceMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-background border border-border rounded-md shadow-lg py-1 min-w-[120px]">
                <button
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setCurrentSpaceId('inbox')
                    setCurrentSpaceName('inbox')
                    setShowSpaceMenu(false)
                  }}
                >
                  inbox
                </button>
                {spaces
                  .filter(space => space.name !== 'inbox')
                  .map(space => (
                    <button
                      key={space.id}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setCurrentSpaceId(space.id)
                        setCurrentSpaceName(space.name)
                        setShowSpaceMenu(false)
                      }}
                    >
                      {space.name}
                    </button>
                  ))}
                <button
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent text-muted-foreground hover:text-foreground flex items-center gap-1"
                  onClick={() => {
                    setShowNewSpaceDialog(true)
                    setShowSpaceMenu(false)
                  }}
                >
                  <Plus className="h-3 w-3" /> New Space
                </button>
              </div>
            )}
          </div>
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

      <Dialog open={showNewSpaceDialog} onOpenChange={setShowNewSpaceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newSpaceName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSpaceName(e.target.value)}
                placeholder="Enter space name..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={newSpaceDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewSpaceDescription(e.target.value)}
                placeholder="Enter space description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSpaceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSpace}>
              Create Space
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">Don't ask me again</span>
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteConfirm(false)
              setNoteToDelete(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => noteToDelete && handleDeleteNote(noteToDelete)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 