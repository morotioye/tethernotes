import { useState } from 'react'

function App() {
  const [note, setNote] = useState('')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">TetherNotes</h1>
        <textarea
          className="w-full h-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Start typing your note..."
        />
      </div>
    </div>
  )
}

export default App 