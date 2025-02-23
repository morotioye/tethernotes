import React from 'react'
import { Copy, Scissors, ClipboardPaste } from 'lucide-react'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from './context-menu'

interface TextContextMenuProps {
  children: React.ReactNode
  className?: string
  onCut?: () => void
  onCopy?: () => void
  onPaste?: () => void
}

export function TextContextMenu({ children, className, onCut, onCopy, onPaste }: TextContextMenuProps) {
  const handleCut = () => {
    document.execCommand('cut')
    onCut?.()
  }

  const handleCopy = () => {
    document.execCommand('copy')
    onCopy?.()
  }

  const handlePaste = () => {
    document.execCommand('paste')
    onPaste?.()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className} asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={handleCut}>
          <Scissors className="mr-2 h-4 w-4" />
          Cut
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">⌘X</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">⌘C</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handlePaste}>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Paste
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">⌘V</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
} 