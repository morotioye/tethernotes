import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { Button } from './ui/button'
import { ChevronDown, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Space {
  id: string
  name: string
  description?: string
}

const NoteInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')
  const [currentSpace, setCurrentSpace] = useState('inbox')
  const [showSpaceMenu, setShowSpaceMenu] = useState(false)
  const [showNewSpaceDialog, setShowNewSpaceDialog] = useState(false)
  const [newSpaceName, setNewSpaceName] = useState('')
  const [newSpaceDescription, setNewSpaceDescription] = useState('')
  const [spaces, setSpaces] = useState<Space[]>([])

  // Auto focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Fetch spaces when component mounts
  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      const spaces = await window.electron.getSpaces()
      setSpaces(spaces)
    } catch (error) {
      console.error('Failed to fetch spaces:', error)
    }
  }

  const handleSave = async (showMain: boolean = false) => {
    const content = textareaRef.current?.value.trim()
    if (content) {
      try {
        await window.electron.saveNote(content, showMain, currentSpace)
        if (textareaRef.current) {
          textareaRef.current.value = ''
          setContent('')
        }
      } catch (error) {
        console.error('Failed to save note:', error)
      }
    }
  }

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
        // Fetch updated spaces list
        await fetchSpaces()
        // Set the newly created space as current
        setCurrentSpace(newSpace.name)
      } catch (error) {
        console.error('Failed to create space:', error)
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
    <>
      <div className="min-h-screen flex flex-col items-center">
        <div className="h-[20vh]" />
        <div className="w-full max-w-3xl bg-sidebar/50 rounded-lg shadow-lg flex flex-col mx-6 border border-border/10">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none p-4 bg-transparent text-foreground focus:outline-none border-none text-lg min-h-[180px] max-h-[180px]"
            placeholder="Type your note here... (Cmd+Enter to save)"
            spellCheck="true"
          />

          <div className="px-6 py-3 flex items-center justify-between bg-sidebar/50 rounded-b-lg">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                onClick={() => setShowSpaceMenu(!showSpaceMenu)}
              >
                {currentSpace}
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpaceMenu && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg py-1 min-w-[120px]">
                  <button
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setCurrentSpace('inbox')
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
                          setCurrentSpace(space.name)
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
    </>
  )
}

export default NoteInput 