// CommonJS wrapper for the ES module server
// This runs the server in Electron's Node.js environment

const { fork } = require('child_process');
const path = require('path');

// Get the server path
const serverPath = path.join(__dirname, 'server.js');

console.log('Starting server from:', serverPath);

// Fork the server as a separate process
const serverProcess = fork(serverPath, [], {
    stdio: 'pipe',
    env: {
        ...process.env,
        PORT: '3001'
    }
});

serverProcess.stdout.on('data', (data) => {
    console.log('Server:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
    console.error('Server Error:', data.toString());
});

serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
});

serverProcess.on('exit', (code) => {
    console.log('Server exited with code:', code);
});

// Handle cleanup
process.on('exit', () => {
    serverProcess.kill();
});

process.on('SIGINT', () => {
    serverProcess.kill();
    process.exit();
});

process.on('SIGTERM', () => {
    serverProcess.kill();
    process.exit();
});
