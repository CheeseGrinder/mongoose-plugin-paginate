import { connect, ConnectOptions, disconnect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const openMongodConnection = async (options: ConnectOptions = {}) => {
    mongod = new MongoMemoryServer();
    await connect(await mongod.getUri(), { 
        ...options,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
}


export const closeMongodConnection = async () => {
    await disconnect();
    if (mongod) await mongod.stop();
  };
  