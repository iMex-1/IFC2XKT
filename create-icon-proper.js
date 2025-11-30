import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';

async function createIcon() {
    console.log('Creating Windows icon from logo...');

    const logoPath = 'gui/src/assets/Logo.png';
    const outputPath = 'build/icon.ico';

    // Create multiple sizes for better quality
    const sizes = [256, 128, 64, 48, 32, 16];
    const pngBuffers = [];

    for (const size of sizes) {
        console.log(`Creating ${size}x${size} version...`);
        const buffer = await sharp(logoPath)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer();
        pngBuffers.push(buffer);
    }

    console.log('Converting to .ico format...');
    const icoBuffer = await pngToIco(pngBuffers);

    fs.writeFileSync(outputPath, icoBuffer);
    console.log('✓ Icon created successfully at', outputPath);
    console.log('✓ Icon size:', (icoBuffer.length / 1024).toFixed(2), 'KB');
}

createIcon().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
