import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import todosRouter from './routes/todos';
import exportRouter from './routes/export';
import { CosmosUnavailableError } from './db';
import { BlobUnavailableError } from './blob';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todosRouter);
app.use('/api/export', exportRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'Root' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CosmosUnavailableError || err instanceof BlobUnavailableError) {
    res.status(503).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Erreur interne.' });
});

app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});
