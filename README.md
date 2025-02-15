# TetherNotes

A lightweight, shortcut-driven note-taking app built with Electron and React.

## Features

- Quick note capture with global shortcut (Cmd/Ctrl + Shift + Space)
- Minimal UI focused on productivity
- Cross-platform support (macOS and Windows)

## Development

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development Mode

To run the app in development mode:

```bash
npm run electron:dev
```

This will start both the Vite dev server and Electron app.

### Linting

To run the linter:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

### Building

To build the app for production:

```bash
npm run build
```

The built application will be available in the `dist` directory.

## Global Shortcuts

- `Cmd/Ctrl + Shift + Space`: Show/Hide the app window
