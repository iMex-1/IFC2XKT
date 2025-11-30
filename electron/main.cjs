const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Setup logging
const logFile = path.join(app.getPath('userData'), 'app.log');
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    try {
        fs.appendFileSync(logFile, logMessage);
    } catch (err) {
        console.error('Failed to write to log:', err);
    }
}

log('=== IFC2XKT Starting ===');
log('App path: ' + app.getAppPath());
log('User data path: ' + app.getPath('userData'));
log('Log file: ' + logFile);

let mainWindow;
let serverProcess;

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    const preloadPath = isDev
        ? path.join(__dirname, 'preload.cjs')
        : path.join(app.getAppPath(), 'electron', 'preload.cjs');

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        },
        backgroundColor: '#fafafa',
        show: false,
        autoHideMenuBar: true
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // In production, files are in app.asar
        const indexPath = path.join(app.getAppPath(), 'gui', 'dist', 'index.html');
        log('Loading index from: ' + indexPath);
        log('App path: ' + app.getAppPath());

        mainWindow.loadFile(indexPath).catch(err => {
            log('Failed to load index.html: ' + err.message);
        });
    }

    // Log any console messages from renderer
    mainWindow.webContents.on('console-message', (_event, level, message) => {
        const levelStr = ['verbose', 'info', 'warning', 'error'][level] || 'log';
        log('Renderer [' + levelStr + ']: ' + message);
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startServer() {
    const serverWrapperPath = isDev
        ? path.join(__dirname, '..', 'server-electron.cjs')
        : path.join(app.getAppPath(), 'server-electron.cjs');

    log('Starting server from: ' + serverWrapperPath);
    log('Server wrapper exists: ' + fs.existsSync(serverWrapperPath));

    // In production, find the actual .exe in the app directory
    // The installed app structure is: AppFolder/XKT Converter.exe
    let exePath;
    if (isDev) {
        exePath = process.execPath;
    } else {
        // Get the directory where the app is installed
        const appDir = path.dirname(process.execPath);
        const exeName = path.basename(process.execPath);
        exePath = path.join(appDir, exeName);

        log('App directory: ' + appDir);
        log('Exe name: ' + exeName);
        log('Full exe path: ' + exePath);
        log('Exe exists: ' + fs.existsSync(exePath));

        // List files in app directory for debugging
        try {
            const files = fs.readdirSync(appDir);
            log('Files in app dir: ' + files.join(', '));
        } catch (err) {
            log('Could not list app dir: ' + err.message);
        }
    }

    serverProcess = spawn(exePath, [serverWrapperPath], {
        cwd: isDev ? path.join(__dirname, '..') : path.dirname(exePath),
        env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: '1',
            NODE_ENV: 'production',
            PORT: '3001',
            TEMP_DIR: global.tempDir,
            OUTPUT_DIR: global.outputDir
        },
        stdio: ['pipe', 'pipe', 'pipe']
    });

    serverProcess.stdout.on('data', (data) => {
        log('Server: ' + data.toString().trim());
    });

    serverProcess.stderr.on('data', (data) => {
        log('Server Error: ' + data.toString().trim());
    });

    serverProcess.on('error', (error) => {
        log('Failed to start server: ' + error.message);
    });

    serverProcess.on('close', (code) => {
        log('Server process exited with code ' + code);
    });
}

app.whenReady().then(() => {
    // Use user's home directory for output and temp in production
    const userDataPath = app.getPath('userData');
    const outputDir = isDev
        ? path.join(__dirname, '..', 'output')
        : path.join(userDataPath, 'output');
    const tempDir = isDev
        ? path.join(__dirname, '..', 'temp')
        : path.join(userDataPath, 'temp');

    log('Output directory: ' + outputDir);
    log('Temp directory: ' + tempDir);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Store paths globally for IPC handlers
    global.outputDir = outputDir;
    global.tempDir = tempDir;

    startServer();

    // Wait a bit for server to start
    setTimeout(() => {
        createWindow();
    }, 2000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});

// IPC handlers
ipcMain.handle('open-output-folder', async () => {
    // Check localStorage for custom output path first
    const customPath = await mainWindow.webContents.executeJavaScript('localStorage.getItem("outputPath")');
    const outputPath = customPath || global.outputDir || path.join(app.getPath('userData'), 'output');
    log('Opening output folder: ' + outputPath);
    shell.openPath(outputPath);
    return { success: true };
});

ipcMain.handle('select-output-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select Output Folder',
        buttonLabel: 'Select Folder'
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return { path: result.filePaths[0] };
    }
    return { path: null };
});

ipcMain.handle('open-log-file', async () => {
    shell.openPath(logFile);
    return { success: true };
});
