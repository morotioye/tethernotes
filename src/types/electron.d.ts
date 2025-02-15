import { PrismaClient } from '@prisma/client'

interface Electron {
  onShowNoteInput: (callback: () => void) => () => void
  onShowSearch: (callback: () => void) => () => void
  prisma: PrismaClient
}

declare global {
  interface Window {
    electron: Electron
  }
} 