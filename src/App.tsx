import React from 'react'
import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <div className="h-screen w-screen flex flex-col bg-background text-foreground">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-semibold">
            Hello World
          </h1>
        </div>
      </div>
    </ThemeProvider>
  )
} 