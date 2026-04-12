import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.BLOB_CONNECTION_STRING;

export class BlobUnavailableError extends Error {
  constructor() {
    super('Blob Storage non disponible (BLOB_CONNECTION_STRING non définie).');
    this.name = 'BlobUnavailableError';
  }
}

let blobServiceClient: BlobServiceClient;

if (connectionString) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
} else {
  console.warn('BLOB_CONNECTION_STRING non définie — les routes liées au Blob Storage ne seront pas disponibles.');
  blobServiceClient = new Proxy({} as BlobServiceClient, {
    get() {
      throw new BlobUnavailableError();
    },
  });
}

export { blobServiceClient };
export const BLOB_CONTAINER = 'uploads';
