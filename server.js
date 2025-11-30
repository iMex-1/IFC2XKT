import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { convert2xkt } from './src/convert2xkt.js';
import WebIFC from 'web-ifc';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup logging
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

const app = express();

// Enable CORS for Electron
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    log('Request: ' + req.method + ' ' + req.url);
    next();
});

log('=== Server Starting ===');
log('__dirname: ' + __dirname);
log('NODE_ENV: ' + process.env.NODE_ENV);

// Get paths from environment (set by Electron) or use defaults
const tempDir = process.env.TEMP_DIR || path.join(__dirname, 'temp');
const defaultOutputDir = process.env.OUTPUT_DIR || path.join(__dirname, 'output');

log('Temp directory: ' + tempDir);
log('Default output directory: ' + defaultOutputDir);

// Store current output directory
let currentOutputDir = defaultOutputDir;

// Configure multer to preserve file extensions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Ensure temp and output directories exist
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(defaultOutputDir)) {
    fs.mkdirSync(defaultOutputDir, { recursive: true });
}

app.post('/api/convert', upload.single('file'), async (req, res) => {
    log('=== Conversion Request ===');

    if (!req.file) {
        log('ERROR: No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const baseName = path.parse(originalName).name;

    log('Input file: ' + originalName);
    log('Input path: ' + inputPath);
    log('File size: ' + req.file.size + ' bytes');

    // Get custom output path from request or use current output directory
    const customOutputPath = req.body.outputPath;
    const baseOutputDir = customOutputPath || currentOutputDir;

    log('Output base directory: ' + baseOutputDir);

    // Create output directory structure: output/filename/filename.ifc and filename.xkt
    const outputDir = path.join(baseOutputDir, baseName);
    log('Creating output directory: ' + outputDir);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const ifcOutputPath = path.join(outputDir, originalName);
    const xktOutputPath = path.join(outputDir, `${baseName}.xkt`);

    log('IFC output: ' + ifcOutputPath);
    log('XKT output: ' + xktOutputPath);

    try {
        // Copy IFC file to output directory
        log('Copying IFC file...');
        fs.copyFileSync(inputPath, ifcOutputPath);
        log('IFC file copied successfully');

        // Convert to XKT with explicit format
        log('Starting conversion...');
        await convert2xkt({
            WebIFC,
            source: inputPath,
            format: 'ifc',
            output: xktOutputPath,
            log: (msg) => log('Converter: ' + msg)
        });

        log('Conversion completed successfully');

        // Cleanup temp file
        fs.unlinkSync(inputPath);
        log('Temp file cleaned up');

        // Send success response with output path
        res.json({
            success: true,
            message: 'Conversion completed',
            outputPath: outputDir
        });

    } catch (error) {
        log('ERROR: Conversion failed - ' + error.message);
        log('Stack trace: ' + error.stack);

        // Cleanup
        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }

        res.status(500).json({ error: 'Conversion failed: ' + error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    log('Health check request received');
    res.json({ status: 'ok', message: 'Server is running' });
});

// Endpoint to get current output directory
app.get('/api/output-path', (req, res) => {
    log('Get output path request');
    res.json({ path: currentOutputDir });
});

// Endpoint to set output directory
app.post('/api/output-path', (req, res) => {
    const newPath = req.body.path;
    if (newPath && fs.existsSync(newPath)) {
        currentOutputDir = newPath;
        res.json({ success: true, path: currentOutputDir });
    } else {
        res.status(400).json({ error: 'Invalid path' });
    }
});

// Endpoint to open output directory
app.post('/api/open-output', (req, res) => {
    const outputPath = currentOutputDir;

    // Open file explorer based on OS
    const command = process.platform === 'win32' ? `explorer "${outputPath}"` :
        process.platform === 'darwin' ? `open "${outputPath}"` :
            `xdg-open "${outputPath}"`;

    exec(command, (error) => {
        if (error) {
            console.error('Error opening directory:', error);
            return res.status(500).json({ error: 'Failed to open directory' });
        }
        res.json({ success: true });
    });
});

const PORT = 3001;
app.listen(PORT, '127.0.0.1', () => {
    log('Server running on http://127.0.0.1:' + PORT);
    log('Server is ready to accept connections');
}).on('error', (err) => {
    log('Server error: ' + err.message);
});
