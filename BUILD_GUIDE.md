# Building the XKT Converter Desktop App

## Quick Build

```bash
npm run build:win
```

The installer will be created at:
```
dist-electron/XKT Converter Setup 1.3.1.exe
```

## What Gets Built

- **Installer**: `XKT Converter Setup 1.3.1.exe` - Full installer with uninstaller
- **Unpacked**: `dist-electron/win-unpacked/` - Portable version (no install needed)

## Installation

1. Run `XKT Converter Setup 1.3.1.exe`
2. Choose installation directory
3. App will be installed with desktop shortcut

## How It Works

The built app includes:
- Electron runtime
- Node.js backend server (starts automatically)
- React frontend (built and bundled)
- All conversion libraries (web-ifc, etc.)
- All dependencies

## User Data Location

When installed, the app stores data in:
```
C:\Users\<YourName>\AppData\Roaming\XKT Converter\
├── output/     # Default output folder
└── temp/       # Temporary upload files
```

Users can change the output folder in Settings.

## Troubleshooting

### App won't start
- Check Windows Event Viewer for errors
- Try running from `dist-electron/win-unpacked/XKT Converter.exe` to see console output

### Server not starting
- Port 3001 might be in use
- Check firewall settings

### Conversion fails
- Make sure web-ifc WASM files are included
- Check app logs in `%APPDATA%\XKT Converter\logs`

## Building for Other Platforms

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

## Development Mode

Test before building:
```bash
npm run electron:dev
```

This runs the app in development mode with hot-reload.

## Reducing Build Size

The current build includes all node_modules. To reduce size:

1. Use `electron-builder`'s `nodeModulesPath` option
2. Exclude dev dependencies
3. Use `asar` compression (already enabled)
4. Remove unused loaders from `@loaders.gl`

Current build size: ~400MB (includes all dependencies)
