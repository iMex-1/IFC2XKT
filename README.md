# XKT Converter

A modern web application for converting IFC files to XKT format with a clean, intuitive interface.

## Features

- 🎨 Clean, minimal UI design
- 📤 Drag & drop file upload
- 📁 Multiple file conversion
- 📊 Real-time conversion progress
- 🗂️ Organized output structure
- ⚡ Fast and lightweight

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install GUI dependencies:**
```bash
cd gui
npm install
cd ..
```

## Usage

### Desktop App (Electron)

**Development Mode:**
```bash
npm run electron:dev
```

**Build Desktop App:**
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

The built app will be in the `dist-electron` folder.

### Web App (Browser)

Run both the server and GUI with one command:

```bash
npm start
```

This will:
- Start the backend server on `http://localhost:3001`
- Start the React GUI on `http://localhost:3000`
- Open your browser automatically

### Convert Files

1. Open `http://localhost:3000` in your browser
2. Drag and drop IFC files onto the dropzone (or click to browse)
3. Click "Convert" button
4. Files will be converted and saved to the `output` directory
5. Click "Open Output" to view your converted files

## Output Structure

Converted files are saved in the `output` directory:

```
output/
├── filename1/
│   ├── filename1.ifc
│   └── filename1.xkt
├── filename2/
│   ├── filename2.ifc
│   └── filename2.xkt
```

Each file gets its own folder containing both the original IFC and converted XKT file.

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

## Requirements

- Node.js v18.x or higher

## License

See LICENSE file for details.
