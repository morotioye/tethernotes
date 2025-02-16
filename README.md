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
