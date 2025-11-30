# XKT Converter - Electron Desktop App

## Development

### Run in Development Mode

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron with hot-reload

### Build Desktop App

**Windows:**
```bash
npm run build:win
```

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

The built application will be in the `dist-electron` folder.

## Features

- ✅ Native desktop application
- ✅ Embedded backend server
- ✅ No browser required
- ✅ Native file system access
- ✅ Auto-updates ready (configure in package.json)
- ✅ Cross-platform (Windows, macOS, Linux)

## How It Works

1. **Electron Main Process** (`electron/main.js`)
   - Creates the application window
   - Starts the Node.js backend server
   - Handles IPC communication

2. **Preload Script** (`electron/preload.js`)
   - Safely exposes Electron APIs to the renderer
   - Provides secure IPC bridge

3. **Renderer Process** (React GUI)
   - Your existing React application
   - Communicates with backend via HTTP
   - Uses Electron IPC for native features

## Distribution

The built app includes:
- Electron runtime
- Node.js backend server
- React frontend (built)
- All dependencies
- Conversion libraries

Users just download and run - no installation of Node.js or dependencies needed!

## Custom Icons

Place your app icons in the `build/` folder:
- `icon.ico` - Windows (256x256)
- `icon.icns` - macOS (512x512)
- `icon.png` - Linux (512x512)

## Configuration

Edit `package.json` under the `build` section to customize:
- App name and ID
- File associations
- Auto-update settings
- Platform-specific options
