import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'src/content');

function processDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            // If we find a 'pictures' folder and a corresponding .md file in the parent directory, let's link them
            if (entry.name === 'pictures') {
                const parentDir = path.dirname(fullPath);
                linkFirstImageToMarkdown(parentDir);
            } else {
                processDirectory(fullPath);
            }
        }
    }
}

function linkFirstImageToMarkdown(entryFolder) {
    const files = fs.readdirSync(entryFolder);
    const mdFile = files.find(f => f.endsWith('.md'));
    const picturesFolder = path.join(entryFolder, 'pictures');

    if (!mdFile || !fs.existsSync(picturesFolder)) return;

    const pictureFiles = fs.readdirSync(picturesFolder).filter(f => /\.(jpg|jpeg|png|webp|avif|JPG)$/i.test(f));
    if (pictureFiles.length === 0) return;

    // Pick the first image found in the pictures folder
    const firstImage = pictureFiles[0];
    const mdPath = path.join(entryFolder, mdFile);
    let mdContent = fs.readFileSync(mdPath, 'utf8');

    // Calculate relative path from the .md file to the picture
    // Since md is in entryFolder and image is in entryFolder/pictures/
    const imageRelativePath = `./pictures/${firstImage}`;

    if (mdContent.includes('heroImage:')) {
        // Replace existing heroImage
        mdContent = mdContent.replace(/heroImage:.*(\r?\n)/, `heroImage: "${imageRelativePath}"\n`);
        console.log(`Updated heroImage for: ${mdFile}`);
    } else {
        // Insert heroImage into frontmatter
        mdContent = mdContent.replace(/^---\s*[\r\n]+/, (match) => `${match}heroImage: "${imageRelativePath}"\n`);
        console.log(`Added heroImage for: ${mdFile}`);
    }

    fs.writeFileSync(mdPath, mdContent, 'utf8');
}

console.log('Scanning content directories for images...');
processDirectory(contentDir);
console.log('Done automation!');
