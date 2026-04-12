import { BlobServiceClient } from '@azure/storage-blob';
import { Request, Response, NextFunction } from 'express';

const connectionString = process.env.BLOB_CONNECTION_STRING;

let blobServiceClient: BlobServiceClient | null = null;

if (connectionString) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
} else {
  console.warn('BLOB_CONNECTION_STRING non définie — les routes liées au Blob Storage ne seront pas disponibles.');
}

export function requireBlob(_req: Request, res: Response, next: NextFunction) {
  if (!blobServiceClient) {
    res.status(503).json({ error: 'Blob Storage non disponible.' });
    return;
  }
  next();
}

export { blobServiceClient };
export const BLOB_CONTAINER = 'uploads';
