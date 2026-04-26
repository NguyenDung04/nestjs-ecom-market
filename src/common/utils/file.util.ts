import { extname } from 'path';
import { randomUUID } from 'crypto';
import type { Request } from 'express';

export function productImageFilename(originalname: string): string {
  const extension = extname(originalname).toLowerCase();
  return `${Date.now()}-${randomUUID()}${extension}`;
}

export function productImageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'), false);
    return;
  }

  cb(null, true);
}
