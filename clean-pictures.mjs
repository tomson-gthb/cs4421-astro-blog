import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'src/content');

function processDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'pictures') {
                cleanPicturesFolder(fullPath);
            } else {
                processDirectory(fullPath);
            }
        }
    }
}

function cleanPicturesFolder(picturesFolder) {
    const files = fs.readdirSync(picturesFolder);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|avif|JPG)$/i.test(f)).sort();

    if (imageFiles.length <= 1) {
        return;
    }

    const folderLabel = path.basename(path.dirname(picturesFolder));
    console.log(`📁 [${folderLabel}] Keeping: ${imageFiles[0]}`);

    for (let i = 1; i < imageFiles.length; i++) {
        const filePath = path.join(picturesFolder, imageFiles[i]);
        fs.unlinkSync(filePath);
        console.log(`   ❌ Deleted: ${imageFiles[i]}`);
    }
}

console.log('Cleaning extra pictures across all folders...');
processDirectory(contentDir);
console.log('Done! Only the first picture remains in each folder.');
