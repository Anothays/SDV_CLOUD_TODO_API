import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type { Todo } from '../types';
import { container } from '../db';

const router = Router();

// GET /api/todos
router.get('/', async (_req: Request, res: Response) => {
  const { resources } = await container.items
    .query<Todo>({ query: 'SELECT * FROM c ORDER BY c.createdAt DESC' })
    .fetchAll();
  res.json(resources);
});

// POST /api/todos
router.post('/', async (req: Request, res: Response) => {
  const { title } = req.body as { title?: string };

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'Le champ "title" est requis.' });
    return;
  }

  const todo: Todo = {
    id: randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const { resource } = await container.items.create(todo);
  res.status(201).json(resource);
});

// PATCH /api/todos/:id
router.patch('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { completed } = req.body as { completed?: boolean };

  if (typeof completed !== 'boolean') {
    res.status(400).json({ error: 'Le champ "completed" doit être un booléen.' });
    return;
  }

  const { resource: existing } = await container.item(id, id).read<Todo>();

  if (!existing) {
    res.status(404).json({ error: 'Tâche introuvable.' });
    return;
  }

  const updated: Todo = { ...existing, completed };
  const { resource } = await container.item(id, id).replace(updated);
  res.json(resource);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const { resource: existing } = await container.item(id, id).read<Todo>();

  if (!existing) {
    res.status(404).json({ error: 'Tâche introuvable.' });
    return;
  }

  await container.item(id, id).delete();
  res.status(204).send();
});

export default router;
