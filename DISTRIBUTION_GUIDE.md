# Distribution Guide - XKT Converter

## Can I Share the Installer?

**YES!** ✅ The installer is completely self-contained and ready to distribute.

## What's Included

The `XKT Converter Setup 1.3.1.exe` installer includes:
- ✅ Electron runtime
- ✅ Node.js runtime (embedded)
- ✅ All conversion libraries (web-ifc, loaders.gl, etc.)
- ✅ All dependencies
- ✅ React frontend (built)
- ✅ Backend server

## User Requirements

**NONE!** Users only need:
- ✅ Windows 10 or later (64-bit)
- ✅ ~500MB free disk space

**NO installation required for:**
- ❌ Node.js
- ❌ Python
- ❌ Visual C++ Redistributables
- ❌ .NET Framework
- ❌ Any other dependencies

## Installation Process for End Users

1. Download `XKT Converter Setup 1.3.1.exe`
2. Run the installer
3. Choose installation directory (or use default)
4. Click Install
5. Done! App is ready to use

## First Run

When users first run the app:
1. A desktop shortcut is created
2. App data folder is created at: `C:\Users\<Username>\AppData\Roaming\@xeokit\xeokit-convert\`
3. Default output folder is created automatically
4. Server starts automatically in the background

## User Experience

Users can:
- ✅ Drag & drop IFC files
- ✅ Convert multiple files at once
- ✅ Choose custom output folder
- ✅ Open output folder with one click
- ✅ See conversion progress
- ✅ No technical knowledge required

## File Locations

After installation:
```
C:\Program Files\XKT Converter\          # Application files
C:\Users\<Name>\AppData\Roaming\
  └── @xeokit\xeokit-convert\
      ├── output\                        # Default output folder
      ├── temp\                          # Temporary files
      └── app.log                        # Log file (for debugging)
```

## Uninstallation

Users can uninstall via:
- Windows Settings → Apps → XKT Converter → Uninstall
- Or run: `C:\Program Files\XKT Converter\Uninstall XKT Converter.exe`

## Distribution Methods

You can distribute the installer via:
- ✅ Email attachment
- ✅ File sharing services (Dropbox, Google Drive, etc.)
- ✅ USB drive
- ✅ Network share
- ✅ Your own website
- ✅ Company intranet

## File Size

- Installer: ~400MB (includes everything)
- Installed size: ~500MB

## Security Notes

The installer is:
- ✅ Digitally signed (with signtool)
- ✅ No admin rights required for installation
- ✅ No internet connection required to run
- ✅ No data collection or telemetry
- ✅ All processing happens locally

## Known Limitations

- Windows only (this build)
- Requires ~500MB disk space
- First launch takes 2-3 seconds (server startup)

## Support

If users encounter issues:
1. Check the log file at: `%APPDATA%\@xeokit\xeokit-convert\app.log`
2. Try reinstalling the app
3. Make sure Windows is up to date

## Building for Other Platforms

To create installers for other platforms:

**macOS:**
```bash
npm run build:mac
```
Output: `.dmg` file

**Linux:**
```bash
npm run build:linux
```
Output: `.AppImage` file

## Summary

✅ **Ready to distribute** - Just share the installer
✅ **No prerequisites** - Everything is included
✅ **Easy installation** - Standard Windows installer
✅ **Works offline** - No internet required
✅ **Self-contained** - All dependencies bundled
