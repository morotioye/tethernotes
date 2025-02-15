import React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  React.useEffect(() => {
    // Always start with light theme
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'

    // Set initial background and text colors explicitly
    document.documentElement.style.backgroundColor = 'hsl(0 0% 100%)'
    document.documentElement.style.color = 'hsl(222.2 84% 4.9%)'

    // Optional: Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
      document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light'
      if (e.matches) {
        document.documentElement.style.backgroundColor = 'hsl(222.2 84% 4.9%)'
        document.documentElement.style.color = 'hsl(210 40% 98%)'
      } else {
        document.documentElement.style.backgroundColor = 'hsl(0 0% 100%)'
        document.documentElement.style.color = 'hsl(222.2 84% 4.9%)'
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
} 