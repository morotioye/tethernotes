# TetherNotes 📝

A lightweight, shortcut-driven note-taking app that lives in your system tray.

## Setup & Running

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Setup database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the app:
```bash
npm run start
```

## Shortcuts

- `Cmd/Ctrl + Shift + Space`: Show/Hide the app window
- `Cmd/Ctrl + J`: Show note input window for quick note creation
- `Cmd/Ctrl + K`: Show search window
- `Cmd/Ctrl + Enter`: Save note (in note input/editor)
- `Cmd/Ctrl + Shift + Enter`: Save note and show main window (in note input)

Standard text editing shortcuts:
- `Cmd/Ctrl + X`: Cut text
- `Cmd/Ctrl + C`: Copy text
- `Cmd/Ctrl + V`: Paste text

## Development

- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues
- `npm run build` - Build for production

## Tech Stack

- Electron
- React
- TypeScript
- Prisma
- SQLite

## License

MIT
