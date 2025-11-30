# Complete Electron App Branding Guide

## Icon Requirements

### Windows (.ico)
- **File**: `build/icon.ico`
- **Sizes**: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256 (all in one .ico file)
- **Format**: 32-bit with alpha channel

### macOS (.icns)
- **File**: `build/icon.icns`
- **Sizes**: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
- **Format**: ICNS (use `png2icons` or `iconutil`)

### Linux (.png)
- **File**: `build/icon.png`
- **Size**: 512x512 or 1024x1024
- **Format**: PNG with transparency

## Directory Structure

```
your-app/
├── build/
│   ├── icon.ico          # Windows
│   ├── icon.icns         # macOS
│   ├── icon.png          # Linux
│   └── installerIcon.ico # Optional: installer-specific icon
├── electron/
│   └── main.js
├── package.json
└── src/
```

## Icon Generation Script

```javascript
// generate-icons.js
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';

async function generateIcons() {
    const source = 'path/to/your/logo.png';
    
    // Windows .ico (multiple sizes in one file)
    const sizes = [256, 128, 64, 48, 32, 16];
    const pngBuffers = [];
    
    for (const size of sizes) {
        const buffer = await sharp(source)
            .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();
        pngBuffers.push(buffer);
    }
    
    const icoBuffer = await pngToIco(pngBuffers);
    fs.writeFileSync('build/icon.ico', icoBuffer);
    
    // Linux .png
    await sharp(source)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile('build/icon.png');
    
    console.log('✓ Icons generated');
}

generateIcons();
```

## package.json Configuration

```json
{
  "name": "your-app",
  "version": "1.0.0",
  "main": "electron/main.js",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name",
    "directories": {
      "output": "dist"
    },
    "files": [
      "electron/**/*",
      "dist/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "win": {
      "target": ["nsis"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "build/icon.icns",
      "category": "public.app-category.productivity"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png",
      "category": "Utility"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "build/icon.ico",
      "uninstallerIcon": "build/icon.ico",
      "installerHeaderIcon": "build/icon.ico",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Your App Name"
    },
    "dmg": {
      "icon": "build/icon.icns",
      "background": "build/dmg-background.png",
      "window": {
        "width": 540,
        "height": 380
      }
    }
  }
}
```

## Electron Main Process (main.js)

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: getIconPath(), // CRITICAL: Set icon here
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
}

function getIconPath() {
    // Different paths for dev vs production
    if (process.env.NODE_ENV === 'development') {
        // Development
        if (process.platform === 'win32') {
            return path.join(__dirname, '../build/icon.ico');
        } else if (process.platform === 'darwin') {
            return path.join(__dirname, '../build/icon.icns');
        } else {
            return path.join(__dirname, '../build/icon.png');
        }
    } else {
        // Production (packaged app)
        if (process.platform === 'win32') {
            return path.join(process.resourcesPath, 'build/icon.ico');
        } else if (process.platform === 'darwin') {
            return path.join(process.resourcesPath, 'build/icon.icns');
        } else {
            return path.join(process.resourcesPath, 'build/icon.png');
        }
    }
}

app.whenReady().then(createWindow);
```

## Common Mistakes to Avoid

### 1. ❌ Wrong Icon Format
```json
// WRONG - Using PNG for Windows
"win": {
  "icon": "build/icon.png"  // ❌ Must be .ico
}

// CORRECT
"win": {
  "icon": "build/icon.ico"  // ✅
}
```

### 2. ❌ Missing Icon in BrowserWindow
```javascript
// WRONG - No icon specified
const win = new BrowserWindow({
    width: 800,
    height: 600
    // ❌ Missing icon property
});

// CORRECT
const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../build/icon.ico') // ✅
});
```

### 3. ❌ Single-Size .ico File
```javascript
// WRONG - Only one size
const buffer = await sharp(source).resize(256, 256).toBuffer();
fs.writeFileSync('icon.ico', buffer); // ❌ Not a proper .ico

// CORRECT - Multiple sizes
const sizes = [256, 128, 64, 48, 32, 16];
const buffers = await Promise.all(
    sizes.map(size => sharp(source).resize(size, size).png().toBuffer())
);
const ico = await pngToIco(buffers); // ✅
```

### 4. ❌ Wrong Path in Production
```javascript
// WRONG - Hardcoded path
icon: 'C:/Users/dev/project/build/icon.ico' // ❌

// CORRECT - Dynamic path
icon: path.join(app.getAppPath(), 'build/icon.ico') // ✅
```

### 5. ❌ Not Including Icons in Build
```json
// WRONG - Icons not in files array
"files": [
  "dist/**/*"
  // ❌ Missing build/icon.*
]

// CORRECT
"files": [
  "dist/**/*",
  "build/icon.*" // ✅
]
```

### 6. ❌ Forgetting NSIS Installer Icons
```json
// INCOMPLETE
"nsis": {
  "oneClick": false
  // ❌ Missing installer icons
}

// COMPLETE
"nsis": {
  "oneClick": false,
  "installerIcon": "build/icon.ico",      // ✅
  "uninstallerIcon": "build/icon.ico",    // ✅
  "installerHeaderIcon": "build/icon.ico" // ✅
}
```

### 7. ❌ Low-Quality Icons
```javascript
// WRONG - Low resolution
await sharp(source).resize(64, 64).toFile('icon.png'); // ❌

// CORRECT - High resolution
await sharp(source).resize(512, 512).toFile('icon.png'); // ✅
```

## Testing Checklist

After building, verify your icon appears in:

### Windows
- [ ] Desktop shortcut
- [ ] Start Menu shortcut
- [ ] Taskbar (when app is running)
- [ ] Alt+Tab switcher
- [ ] Task Manager
- [ ] Window title bar
- [ ] .exe file icon in Explorer
- [ ] Installer icon

### macOS
- [ ] Dock icon
- [ ] Launchpad
- [ ] Finder
- [ ] Cmd+Tab switcher
- [ ] .app bundle icon
- [ ] DMG installer icon

### Linux
- [ ] Application menu
- [ ] Taskbar
- [ ] Window title bar
- [ ] .AppImage file icon

## Windows Icon Cache Issues

If Windows shows old icon:
```powershell
# Clear icon cache
ie4uinit.exe -show
ie4uinit.exe -ClearIconCache

# Or delete cache manually
del /f /s /q /a %localappdata%\IconCache.db
shutdown /r /t 0
```

## Production Build Commands

```bash
# Install dependencies
npm install --save-dev electron-builder sharp png-to-ico

# Generate icons
node generate-icons.js

# Build for all platforms
npm run build:win
npm run build:mac
npm run build:linux
```

## package.json Scripts

```json
{
  "scripts": {
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mwl",
    "generate-icons": "node generate-icons.js"
  }
}
```

## Final Verification

```javascript
// Add to main.js for debugging
console.log('Icon path:', getIconPath());
console.log('Icon exists:', require('fs').existsSync(getIconPath()));
```

## Summary

✅ **DO**:
- Use multi-size .ico files (16-256px)
- Set icon in BrowserWindow constructor
- Include icons in build files array
- Set all NSIS installer icons
- Use high-resolution source (1024x1024+)
- Test on clean Windows install

❌ **DON'T**:
- Use PNG for Windows .exe
- Forget icon in BrowserWindow
- Use single-size .ico
- Hardcode icon paths
- Skip installer icon configuration
- Use low-resolution source images
