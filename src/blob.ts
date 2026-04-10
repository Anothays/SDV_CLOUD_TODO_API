import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.BLOB_CONNECTION_STRING;

if (!connectionString) {
  throw new Error('La variable BLOB_CONNECTION_STRING est manquante.');
}

export const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
export const BLOB_CONTAINER = 'uploads';
