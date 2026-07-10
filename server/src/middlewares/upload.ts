import path from 'path';
import { randomUUID } from 'crypto';
import multer, { type FileFilterCallback } from 'multer';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler';

const UPLOAD_DIR = path.join(__dirname, '../../uploads/receipts');
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOAD_DIR),
  filename: (_req, file, callback) => {
    callback(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

function imageOnlyFilter(_req: Request, file: Express.Multer.File, callback: FileFilterCallback) {
  if (!file.mimetype.startsWith('image/')) {
    callback(new Error('Only image uploads are allowed'));
    return;
  }
  callback(null, true);
}

const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: imageOnlyFilter,
});

export function uploadSingleImage(fieldName: string) {
  const middleware = uploadImage.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        next(new AppError(message, 400, 'UPLOAD_ERROR'));
        return;
      }
      next();
    });
  };
}

// In-memory (not persisted to disk) — used for photos that are only needed
// transiently, e.g. sending to an external identification API.
const uploadImageToMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: imageOnlyFilter,
});

export function uploadSingleImageToMemory(fieldName: string) {
  const middleware = uploadImageToMemory.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        next(new AppError(message, 400, 'UPLOAD_ERROR'));
        return;
      }
      next();
    });
  };
}
