import React, { useState } from 'react'

function App() {
  const [note, setNote] = useState('')

  return (
    <div className="h-screen p-4">
      <textarea
        className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Start typing your note..."
      />
    </div>
  )
}

export default App 