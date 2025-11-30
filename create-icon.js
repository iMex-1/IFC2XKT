import pngToIco from 'png-to-ico';
import fs from 'fs';

console.log('Converting logo to .ico format...');

pngToIco('gui/src/assets/Logo.png')
    .then(buf => {
        fs.writeFileSync('build/icon.ico', buf);
        console.log('✓ Icon created successfully at build/icon.ico');
    })
    .catch(err => {
        console.error('Error creating icon:', err);
    });
