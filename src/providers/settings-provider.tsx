import * as React from 'react'
import { type UserSettings, DEFAULT_USER_SETTINGS } from '../types/user'
import { prisma } from '../lib/db'

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateSettingPath: <T>(path: string[], value: T) => Promise<void>
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: React.ReactNode
  userId: string
}

export function SettingsProvider({ children, userId }: SettingsProviderProps) {
  const [settings, setSettings] = React.useState<UserSettings>(DEFAULT_USER_SETTINGS)
  const [loading, setLoading] = React.useState(true)

  // Load settings on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { settings: true }
        })
        
        if (user) {
          setSettings(JSON.parse(user.settings as string))
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [userId])

  // Update entire settings object
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      await prisma.user.update({
        where: { id: userId },
        data: { settings: JSON.stringify(updatedSettings) }
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  }

  // Update a specific path in settings
  const updateSettingPath = async <T,>(path: string[], value: T) => {
    try {
      const newSettings = { ...settings }
      let current: any = newSettings
      
      // Navigate to the nested property
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      
      // Update the value
      current[path[path.length - 1]] = value
      
      // Save to database
      await prisma.user.update({
        where: { id: userId },
        data: { settings: JSON.stringify(newSettings) }
      })
      
      setSettings(newSettings)
    } catch (error) {
      console.error('Failed to update setting:', error)
      throw error
    }
  }

  if (loading) {
    return null // Or a loading spinner
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSettingPath }}>
      {children}
    </SettingsContext.Provider>
  )
}

// Hook to use settings
export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

// Utility hook for updating a specific setting
export function useSettingUpdate() {
  const { updateSettingPath } = useSettings()
  
  return React.useCallback(<T,>(path: string[], value: T) => {
    return updateSettingPath(path, value)
  }, [updateSettingPath])
} 