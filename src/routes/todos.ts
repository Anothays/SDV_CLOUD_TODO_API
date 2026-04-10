import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type { Todo } from '../types';

const router = Router();

// In-memory store — sera remplacé par Cosmos DB
const todos: Todo[] = [];

// GET /api/todos
router.get('/', (_req: Request, res: Response) => {
  res.json(todos);
});

// POST /api/todos
router.post('/', (req: Request, res: Response) => {
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

  todos.unshift(todo);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id
router.patch('/:id', (req: Request, res: Response) => {
  const todo = todos.find((t) => t.id === req.params.id);

  if (!todo) {
    res.status(404).json({ error: 'Tâche introuvable.' });
    return;
  }

  const { completed } = req.body as { completed?: boolean };

  if (typeof completed !== 'boolean') {
    res.status(400).json({ error: 'Le champ "completed" doit être un booléen.' });
    return;
  }

  todo.completed = completed;
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = todos.findIndex((t) => t.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Tâche introuvable.' });
    return;
  }

  todos.splice(idx, 1);
  res.status(204).send();
});

export default router;
