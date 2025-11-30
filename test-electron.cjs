const { app } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(() => {
    console.log('=== Path Debug ===');
    console.log('__dirname:', __dirname);
    console.log('process.resourcesPath:', process.resourcesPath);
    console.log('app.getAppPath():', app.getAppPath());

    const indexPath = path.join(process.resourcesPath, 'app.asar', 'gui', 'dist', 'index.html');
    console.log('Looking for index at:', indexPath);
    console.log('Exists:', fs.existsSync(indexPath));

    // Try alternative paths
    const alt1 = path.join(__dirname, 'gui', 'dist', 'index.html');
    console.log('Alt path 1:', alt1, 'Exists:', fs.existsSync(alt1));

    const alt2 = path.join(app.getAppPath(), 'gui', 'dist', 'index.html');
    console.log('Alt path 2:', alt2, 'Exists:', fs.existsSync(alt2));

    app.quit();
});
