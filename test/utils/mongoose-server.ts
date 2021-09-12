import { connect, ConnectOptions, disconnect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export async function openMongodConnection(options: ConnectOptions = {}): Promise<void> {
  mongod = new MongoMemoryServer();
  await connect(await mongod.getUri(), {
    ...options,
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
}

export async function closeMongodConnection(): Promise<void> {
  await disconnect();
  await mongod?.stop();
}
