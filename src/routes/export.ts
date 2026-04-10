import { Router, Request, Response } from 'express';
import { container } from '../db';
import { blobServiceClient, BLOB_CONTAINER } from '../blob';
import type { Todo } from '../types';

const router = Router();

// POST /api/export
router.post('/', async (_req: Request, res: Response) => {
  const { resources } = await container.items
    .query<Todo>({ query: 'SELECT * FROM c ORDER BY c.createdAt DESC' })
    .fetchAll();

  const filename = `todos-${Date.now()}.json`;
  const content = JSON.stringify(resources, null, 2);

  const containerClient = blobServiceClient.getContainerClient(BLOB_CONTAINER);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  await blockBlobClient.upload(content, Buffer.byteLength(content), {
    blobHTTPHeaders: { blobContentType: 'application/json' },
  });

  res.json({ url: blockBlobClient.url });
});

export default router;
