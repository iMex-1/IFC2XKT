import { rcedit } from 'rcedit';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const exePath = path.join(__dirname, 'dist-electron', 'win-unpacked', 'IFC2XKT.exe');
const iconPath = path.join(__dirname, 'build', 'icon.ico');

console.log('Setting icon on executable...');
console.log('EXE:', exePath);
console.log('Icon:', iconPath);

rcedit(exePath, {
    icon: iconPath,
    'version-string': {
        'ProductName': 'IFC2XKT',
        'FileDescription': 'IFC to XKT Converter',
        'CompanyName': 'IFC2XKT',
        'LegalCopyright': '© 2025',
        'OriginalFilename': 'IFC2XKT.exe'
    }
}).then(() => {
    console.log('✓ Icon set successfully!');
}).catch(err => {
    console.error('Error setting icon:', err);
});
