/* Centralised FAQ data — 5 questions per tool page */

const FAQ_DATA = {
  imageConverter: [
    { q: 'Which image formats are supported for conversion?', a: 'We support JPG, PNG, WEBP, SVG, GIF, BMP, ICO, and TIFF. You can convert between any of these formats instantly in your browser.' },
    { q: 'Will the image quality be affected during conversion?', a: 'For lossless formats like PNG, quality is fully preserved. For lossy formats like JPG and WEBP, we use optimized encoding settings to maintain the best possible visual quality while keeping file sizes efficient.' },
    { q: 'Is there a file size or quantity limit?', a: 'There is no hard limit — you can upload multiple images at once and batch-convert them. Because everything runs locally in your browser, speed depends on your device rather than a server.' },
    { q: 'Is my data safe? Are images uploaded to a server?', a: 'Absolutely. All processing happens 100% in your browser. Your images never leave your device, ensuring complete privacy and security.' },
    { q: 'Can I convert transparent PNG images to JPG?', a: 'Yes. Since JPG does not support transparency, transparent areas will be filled with a white background by default, producing a clean result.' },
  ],

  imageCompressor: [
    { q: 'How does image compression work?', a: 'Our tool reduces file size by re-encoding the image at a lower quality level using your browser\'s built-in canvas API. You control the compression ratio so you can balance size and quality.' },
    { q: 'Will compression visibly reduce my image quality?', a: 'At moderate compression levels (20-40%), the difference is virtually unnoticeable to the human eye. Higher compression saves more space but may introduce slight artifacts.' },
    { q: 'What image formats can I compress?', a: 'You can upload JPG, PNG, WEBP, BMP, and most other common raster formats. The output is saved as an optimized JPEG for maximum size reduction.' },
    { q: 'Can I compress multiple images at once?', a: 'Yes! Simply drag and drop or select several files. Each image\'s compression level can be adjusted individually, and you can download them all as a ZIP.' },
    { q: 'Do you store my compressed images on a server?', a: 'No. Everything runs locally in your browser. Your images are never uploaded anywhere, so your files remain completely private.' },
  ],

  cropImage: [
    { q: 'Can I crop images to a specific aspect ratio?', a: 'Yes. You can choose from preset ratios like 1:1, 4:3, 16:9, or enter a custom ratio. You can also crop freely without any ratio constraint.' },
    { q: 'Does cropping reduce image quality?', a: 'No. Cropping simply removes pixels outside the selected area. The remaining pixels retain their original resolution and quality.' },
    { q: 'Can I crop multiple images at once?', a: 'Absolutely. Upload multiple images, set crop areas for each, and download them all in one go — either as a ZIP or individually.' },
    { q: 'What file formats are supported for cropping?', a: 'All common image formats are supported including JPG, PNG, WEBP, GIF, and BMP. The output preserves the original format.' },
    { q: 'Are my images uploaded to a server for processing?', a: 'No. All cropping is performed locally in your browser using the HTML5 Canvas API. Your images never leave your device.' },
  ],

  resizeImage: [
    { q: 'Can I resize images to exact pixel dimensions?', a: 'Yes. Enter your desired width and height in pixels, inches, or centimeters. You can also lock the aspect ratio to prevent distortion.' },
    { q: 'Will resizing make my image blurry?', a: 'Enlarging an image beyond its original resolution may introduce slight softening. Downsizing retains sharpness. We use high-quality bicubic interpolation for the best results.' },
    { q: 'Can I resize in bulk?', a: 'Yes. Upload multiple images and apply the same target dimensions to all of them. Download individually or as a ZIP archive.' },
    { q: 'What units can I use for dimensions?', a: 'You can specify dimensions in pixels, inches, centimeters, or as a percentage of the original size.' },
    { q: 'Is any data sent to a server during resizing?', a: 'No. Resizing is performed entirely in your browser. Your images stay on your device and are never uploaded.' },
  ],

  removeBackground: [
    { q: 'How does background removal work?', a: 'We use an advanced AI model that runs directly in your browser to detect the subject and separate it from the background, producing a transparent PNG.' },
    { q: 'Does it work with complex backgrounds?', a: 'Yes. The AI model handles a wide variety of scenes including busy backgrounds, gradients, and similar-color subjects. Results are best with clear subject–background contrast.' },
    { q: 'Can I remove backgrounds from multiple images at once?', a: 'Yes. Upload several images and the tool will process them sequentially. You can download all results as a ZIP or one at a time.' },
    { q: 'What format is the output?', a: 'The output is always a PNG file with a transparent background, which you can layer on top of any design.' },
    { q: 'Are my images sent to a server?', a: 'No. The AI model runs entirely in your browser using WebAssembly. Your images remain on your device at all times.' },
  ],

  watermarkImage: [
    { q: 'What types of watermarks can I add?', a: 'You can add text watermarks with custom font, size, color, and opacity, as well as image watermarks (like a logo). Both can be positioned, rotated, and tiled.' },
    { q: 'Can I apply the same watermark to multiple images?', a: 'Yes. Upload several images, configure your watermark once, and it will be applied to all of them in a single batch.' },
    { q: 'Will the watermark reduce my image quality?', a: 'No. The watermark is composited onto the original image at full resolution. You get the same quality as the source file.' },
    { q: 'Can I adjust the watermark opacity?', a: 'Absolutely. Use the opacity slider to make the watermark as subtle or as prominent as you like — from nearly invisible to fully solid.' },
    { q: 'Is any data uploaded to a server?', a: 'No. All watermarking is done locally in your browser. Your images and logos are never transmitted anywhere.' },
  ],

  qrCodeGenerator: [
    { q: 'What types of data can I encode in a QR code?', a: 'You can encode URLs, plain text, Wi-Fi credentials, email addresses, phone numbers, SMS messages, vCards, and more.' },
    { q: 'Can I customize the colors and style of my QR code?', a: 'Yes. Choose custom foreground and background colors, add a logo or icon in the center, and select from multiple dot/corner styles.' },
    { q: 'What formats can I download the QR code in?', a: 'You can download your QR code as a PNG, SVG, or JPEG file, in a resolution of your choice.' },
    { q: 'Will adding a logo make the QR code unscannable?', a: 'Our tool uses error correction to ensure the QR code remains scannable even with a centered logo, as long as the logo doesn\'t cover too much of the code.' },
    { q: 'Is the QR code generation done on a server?', a: 'No. QR codes are generated entirely in your browser. No data is sent to any server — your information stays private.' },
  ],

  qrCodeScanner: [
    { q: 'How do I scan a QR code?', a: 'You can use your device camera for live scanning, or upload an image containing a QR code. The result is displayed instantly.' },
    { q: 'What types of QR codes can be read?', a: 'Our scanner reads all standard QR code formats including URLs, text, Wi-Fi credentials, vCards, and more.' },
    { q: 'Does the scanner work on mobile devices?', a: 'Yes. The scanner uses your device\'s camera via the browser and works on both Android and iOS devices without installing any app.' },
    { q: 'Is my camera feed stored or sent anywhere?', a: 'No. Camera processing happens entirely in your browser. We never record, store, or transmit your camera feed.' },
    { q: 'Can I scan QR codes from screenshots or saved images?', a: 'Absolutely. Use the upload option to scan a QR code from any saved image, screenshot, or photo on your device.' },
  ],

  faceBlur: [
    { q: 'How does face detection work?', a: 'We use an AI-powered face detection model that runs directly in your browser. It identifies faces in the image so you can apply a blur effect to them.' },
    { q: 'Can I choose which faces to blur?', a: 'Yes. After detection, each face region is highlighted and you can select which ones to blur and adjust the blur intensity for each.' },
    { q: 'What blur styles are available?', a: 'You can choose from Gaussian blur, pixelation, or a solid color overlay. The intensity of each effect is fully adjustable.' },
    { q: 'Can I blur faces in multiple images at once?', a: 'Yes. Upload several images, configure blur regions, and download all processed images together as a ZIP or individually.' },
    { q: 'Are my photos sent to a remote server?', a: 'No. The AI model runs in your browser using WebAssembly. Your photos are never uploaded to any server.' },
  ],

  memeGenerator: [
    { q: 'Do I need to sign up to create memes?', a: 'No. Our meme generator is completely free to use with no sign-up or login required. Just upload an image and start creating.' },
    { q: 'Can I use my own images as meme templates?', a: 'Yes. Upload any image from your device or choose from popular meme templates to get started quickly.' },
    { q: 'What text customization options are available?', a: 'You can customize font style, size, color, stroke, shadow, position, and alignment. Classic meme fonts like Impact are included.' },
    { q: 'What format are the downloaded memes in?', a: 'Memes are downloaded as high-quality PNG images, ready to share on social media or messaging apps.' },
    { q: 'Is my data private?', a: 'Yes. Everything runs in your browser. Your images and memes are never uploaded to any server.' },
  ],

  photoEditor: [
    { q: 'What editing features are available?', a: 'You can adjust brightness, contrast, saturation, apply filters, add text, overlays, frames, stickers, and much more — all inside your browser.' },
    { q: 'Can I undo and redo changes?', a: 'Yes. The editor supports full undo/redo history so you can experiment freely without worrying about losing your work.' },
    { q: 'What file formats can I edit and export?', a: 'You can edit JPG, PNG, WEBP, and other common formats. The edited image can be exported in your preferred format and quality.' },
    { q: 'Does the editor work on mobile?', a: 'Yes. The editor is fully responsive and touch-friendly, so you can edit images on your phone or tablet.' },
    { q: 'Are my images stored on your servers?', a: 'No. All editing is done locally. Your images never leave your device.' },
  ],

  upscaleImage: [
    { q: 'How does AI upscaling work?', a: 'Our tool uses a neural network model running in your browser to intelligently add detail and sharpness when enlarging an image, producing results far superior to simple interpolation.' },
    { q: 'How much can I enlarge my image?', a: 'You can upscale by 2×, 3×, or 4× the original resolution. Higher factors produce larger files but the AI maintains clarity.' },
    { q: 'Will the upscaled image look blurry?', a: 'The AI enhancement specifically targets blur and softness, adding realistic detail. Results are significantly sharper than traditional resizing methods.' },
    { q: 'What image formats are supported?', a: 'You can upload JPG, PNG, and WEBP images. The output is saved in the same format as the original.' },
    { q: 'Is any data sent to a server?', a: 'No. The AI model runs entirely in your browser. Your images remain on your device and are never uploaded.' },
  ],
};

export default FAQ_DATA;
