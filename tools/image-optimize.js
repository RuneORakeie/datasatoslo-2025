const sharp = require('sharp');
const { glob } = require('glob');
const path = require('path');
const fs = require('fs');
const { Logger, LogLevel } = require('plop-logger');
const { colorEmojiConfig } = require('plop-logger/lib/extra/colorEmojiConfig');

Logger.config = colorEmojiConfig;
const logger = Logger.getLogger('image-optimizer');
logger.level = LogLevel.All;

function cleanupGeneratedImages(filepath) {
    const ext = path.extname(filepath);
    const basename = path.basename(filepath, ext);
    const dirname = path.dirname(filepath);

    // List of patterns to clean up
    const patterns = [
        `${basename}-mini${ext}`,
        `${basename}.webp`,
        `${basename}-mini.webp`
    ];

    patterns.forEach(pattern => {
        const filePath = path.join(dirname, pattern);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`Cleaned up: ${filePath}`);
        }
    });
}

async function processImage(filepath) {
    try {
        const ext = path.extname(filepath);
        const basename = path.basename(filepath, ext);
        const dirname = path.dirname(filepath);

        // Clean up previously generated images
        cleanupGeneratedImages(filepath);

        // Create mini version in original format
        const miniPath = path.join(dirname, `${basename}-mini${ext}`);
        const webpPath = path.join(dirname, `${basename}.webp`);
        const miniWebpPath = path.join(dirname, `${basename}-mini.webp`);

        // Process original to mini version
        await sharp(filepath)
            .resize(800, 600, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFile(miniPath);
        logger.info(`Created mini version: ${miniPath}`);

        // Create WebP version of original
        await sharp(filepath)
            .webp({ quality: 80 })
            .toFile(webpPath);
        logger.info(`Created WebP version: ${webpPath}`);

        // Create WebP version of mini
        await sharp(filepath)
            .resize(800, 600, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(miniWebpPath);
        logger.info(`Created mini WebP version: ${miniWebpPath}`);

    } catch (error) {
        logger.error(`Error processing ${filepath}:`, error);
    }
}

async function main() {
    const imagePattern = 'static/images/blog/**/*.{jpg,jpeg,png}';
    logger.info('Processing images:', imagePattern);

    try {
        const files = await glob(imagePattern);
        logger.info(`Found ${files.length} images to process`);

        await Promise.all(files.map(processImage));
        
        logger.info('Image processing complete');
    } catch (error) {
        logger.error('Error during image processing:', error);
        process.exit(1);
    }
}

main();