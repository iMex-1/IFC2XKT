# IFC2XKT - IFC to XKT Converter

A desktop application for converting IFC (Industry Foundation Classes) files to XKT format for use with xeokit.

## Features

- 🎨 Clean, modern user interface
- 📤 Drag & drop file upload
- 📁 Multiple file conversion
- 📊 Real-time conversion progress
- ⚙️ Custom output folder selection
- 🗂️ Organized output structure
- ⚡ Fast and efficient conversion

## Installation

### For End Users

1. Download `IFC2XKT Setup 1.3.1.exe`
2. Run the installer
3. Follow the installation wizard
4. Launch IFC2XKT from your desktop or Start Menu

**Requirements:**
- Windows 10 or later (64-bit)
- ~500MB free disk space
- No additional software needed (all dependencies included)

## Usage

1. **Launch the app** - Open IFC2XKT
2. **Add files** - Drag & drop IFC files or click to browse
3. **Choose output folder** (optional) - Click ⚙️ Settings to select a custom location
4. **Convert** - Click the Convert button
5. **Access files** - Click 📁 Open Output to view converted files

## Output Structure

Converted files are organized in folders:

```
output/
├── Building1/
│   ├── Building1.ifc
│   └── Building1.xkt
├── Building2/
│   ├── Building2.ifc
│   └── Building2.xkt
```

Each file gets its own folder containing both the original IFC and converted XKT file.

## Default Locations

- **Output folder**: `%APPDATA%\@xeokit\xeokit-convert\output`
- **Temporary files**: `%APPDATA%\@xeokit\xeokit-convert\temp`
- **Log file**: `%APPDATA%\@xeokit\xeokit-convert\app.log`

## Development

### Prerequisites

- Node.js v18.x or higher
- npm

### Setup

```bash
# Install dependencies
npm install

# Install GUI dependencies
cd gui
npm install
cd ..
```

### Running in Development

```bash
# Start web version (browser)
npm start

# Start Electron app (desktop)
npm run electron:dev
```

### Building

```bash
# Build Windows installer
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

Output: `dist-electron/IFC2XKT Setup 1.3.1.exe`

## Architecture

- **Frontend**: React with Vite
- **Backend**: Node.js Express server
- **Desktop**: Electron
- **Conversion**: web-ifc library
- **Animations**: Framer Motion

## Project Structure

```
ifc2xkt/
├── electron/           # Electron main process
│   ├── main.cjs       # Main process entry
│   └── preload.cjs    # Preload script
├── gui/               # React frontend
│   ├── src/
│   │   ├── App.jsx    # Main app component
│   │   ├── App.css    # Styles
│   │   └── main.jsx   # Entry point
│   └── index.html
├── src/               # Conversion library
├── server.js          # Express backend
├── server-electron.cjs # Server wrapper for Electron
└── convert2xkt.js     # CLI tool
```

## Command Line Usage

You can also use the converter from the command line:

```bash
node convert2xkt.js -s "./input/file.ifc" -o "./output/file.xkt" -l
```

### Options

- `-s` - Path to source IFC file
- `-o` - Output path for XKT file
- `-f` - Source file format (optional)
- `-l` - Enable logging
- `-g` - Disable geometry reuse
- `-z` - Set minimum tile size (default 500)

## Troubleshooting

### Conversion Fails

- Check the log file at `%APPDATA%\@xeokit\xeokit-convert\app.log`
- Ensure the IFC file is valid
- Try converting a smaller file first

### App Won't Start

- Make sure Windows is up to date
- Try reinstalling the application
- Check Windows Event Viewer for errors

### Files Not Appearing

- Click "Open Output" to verify the output location
- Check if you set a custom output folder in Settings
- Ensure you have write permissions to the output directory

## Distribution

The installer is completely self-contained and can be distributed via:
- Email
- File sharing services (Dropbox, Google Drive, etc.)
- USB drive
- Network share
- Company intranet

No additional software or dependencies are required for end users.

## Technical Details

### Conversion Process

1. File is uploaded to temporary directory
2. IFC file is parsed using web-ifc
3. Geometry is converted to XKT format
4. Original IFC and converted XKT are saved to output folder
5. Temporary files are cleaned up

### XKT Format

XKT is xeokit's native format, optimized for:
- Fast loading over the web
- Efficient memory usage
- Large model support
- Compression (typically 7-20x smaller than IFC)

## License

See LICENSE file for details.

## Credits

Built with:
- [xeokit-convert](https://github.com/xeokit/xeokit-convert) - Conversion library
- [web-ifc](https://github.com/tomvandig/web-ifc) - IFC parsing
- [Electron](https://www.electronjs.org/) - Desktop framework
- [React](https://react.dev/) - UI framework
- [Express](https://expressjs.com/) - Backend server

## Version

Current version: 1.3.1

## Support

For issues or questions, check the log file at:
```
%APPDATA%\@xeokit\xeokit-convert\app.log
```
