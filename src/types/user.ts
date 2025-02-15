export type UserSettings = {
  appearance: {
    theme: 'light' | 'dark' | 'system'
    fontSize: 'small' | 'medium' | 'large'
    reduceMotion: boolean
  }
  editor: {
    fontFamily: string
    lineNumbers: boolean
    wordWrap: boolean
    tabSize: number
  }
  notifications: {
    enabled: boolean
    sound: boolean
    desktop: boolean
  }
  sync: {
    enabled: boolean
    interval: number // in minutes
  }
}

export type User = {
  id: string
  email: string
  name: string | null
  settings: UserSettings
  createdAt: Date
  updatedAt: Date
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    reduceMotion: false
  },
  editor: {
    fontFamily: 'monospace',
    lineNumbers: true,
    wordWrap: true,
    tabSize: 2
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: false
  },
  sync: {
    enabled: true,
    interval: 5
  }
} 