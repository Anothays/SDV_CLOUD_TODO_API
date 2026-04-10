import { CosmosClient, Container } from '@azure/cosmos';

const connectionString = process.env.COSMOS_CONNECTION_STRING;

if (!connectionString) {
  throw new Error('La variable COSMOS_CONNECTION_STRING est manquante.');
}

const client = new CosmosClient(connectionString);

const database = client.database('todo-db');
export const container: Container = database.container('todos');
