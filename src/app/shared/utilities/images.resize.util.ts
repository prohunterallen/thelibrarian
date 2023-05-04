import * as sharp from 'sharp';
import { join } from 'path';
import * as fs from 'fs';
import { ImageSize } from '../variable.share';

// Resize and save images
export async function resizeAndSaveImages(
  file: Express.Multer.File,
): Promise<{ size: ImageSize; path: string }[]> {
  const largeImagePath = join('contents', 'large_' + file.filename);
  const mediumImagePath = join('contents', 'medium_' + file.filename);
  const smallImagePath = join('contents', 'small_' + file.filename);

  await sharp(file.path).resize(1024).toFile(largeImagePath);
  await sharp(file.path).resize(512).toFile(mediumImagePath);
  await sharp(file.path).resize(256).toFile(smallImagePath);

  console.log('Original file path:', file.path);

  //delete original file
  fs.unlinkSync(file.path);

  return [
    { size: ImageSize.LARGE, path: largeImagePath },
    { size: ImageSize.MEDIUM, path: mediumImagePath },
    { size: ImageSize.SMALL, path: smallImagePath },
  ];
}

// Delete existing images
export async function deleteExistingImages(
  images: { size: ImageSize; path: string }[],
): Promise<void> {
  images.forEach((image) => {
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }
  });
}
