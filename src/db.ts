import { CosmosClient, Container } from '@azure/cosmos';
import { Request, Response, NextFunction } from 'express';

const connectionString = process.env.COSMOS_CONNECTION_STRING;

let container: Container | null = null;

if (connectionString) {
  const client = new CosmosClient(connectionString);
  const database = client.database('todo-db');
  container = database.container('todos');
} else {
  console.warn('COSMOS_CONNECTION_STRING non définie — les routes liées à la base de données ne seront pas disponibles.');
}

export function requireDb(_req: Request, res: Response, next: NextFunction) {
  if (!container) {
    res.status(503).json({ error: 'Base de données non disponible.' });
    return;
  }
  next();
}

export { container };
