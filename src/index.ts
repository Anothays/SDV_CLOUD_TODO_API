import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import todosRouter from './routes/todos';
import exportRouter from './routes/export';

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

app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});
