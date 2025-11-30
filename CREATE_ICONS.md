# How to Create App Icons

Your logo needs to be converted to Windows `.ico` format.

## Quick Method (Online Tool)

1. Go to: https://convertio.co/png-ico/
2. Upload your `gui/src/assets/Logo.png`
3. Set size to **256x256** pixels
4. Download the `.ico` file
5. Save it as `build/icon.ico`

## Alternative (Using GIMP - Free)

1. Download GIMP: https://www.gimp.org/downloads/
2. Open your logo in GIMP
3. Image → Scale Image → Set to 256x256
4. File → Export As
5. Save as `icon.ico`
6. Choose "256x256, 32 bpp, 8-bit alpha" format
7. Save to `build/icon.ico`

## Alternative (Using ImageMagick - Command Line)

If you have ImageMagick installed:

```bash
magick convert gui/src/assets/Logo.png -resize 256x256 build/icon.ico
```

## After Creating the Icon

Once you have `build/icon.ico`:

1. Make sure it's in the `build/` folder
2. Run: `npm run build:win`
3. The new installer will have your custom icon!

## Icon Requirements

- **Format**: `.ico` (Windows Icon)
- **Size**: 256x256 pixels (minimum)
- **Location**: `build/icon.ico`
- **Transparency**: Supported (recommended)

## Current Status

The build folder exists at: `build/`
Currently contains: `icon-info.txt`

You need to add: `build/icon.ico`
