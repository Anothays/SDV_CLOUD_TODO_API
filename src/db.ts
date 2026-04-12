import { CosmosClient, Container } from '@azure/cosmos';

const connectionString = process.env.COSMOS_CONNECTION_STRING;

export class CosmosUnavailableError extends Error {
  constructor() {
    super('Base de données non disponible (COSMOS_CONNECTION_STRING non définie).');
    this.name = 'CosmosUnavailableError';
  }
}

let container: Container;

if (connectionString) {
  const client = new CosmosClient(connectionString);
  const database = client.database('todo-db');
  container = database.container('todos');
} else {
  console.warn('COSMOS_CONNECTION_STRING non définie — les routes liées à la base de données ne seront pas disponibles.');
  container = new Proxy({} as Container, {
    get() {
      throw new CosmosUnavailableError();
    },
  });
}

export { container };
