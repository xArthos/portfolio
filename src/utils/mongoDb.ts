// Modules
import { MongoClient, Db } from 'mongodb';

// Utils
import { consoleMessage, consoleMessageResult } from './consoleMessage';

// Config
import 'dotenv/config';

type MongoConnection = {
    client: MongoClient;
    db: Db;
};

declare global {
    var mongodb: {
        conn: MongoConnection | null;
        promise: Promise<MongoConnection> | null;
    };
};

if (!process.env.DB_CONN_STRING) {
    throw new Error(
        'Define the DB_CONN_STRING environment variable inside .env'
    );
};

if (!process.env.DB_NAME) {
    throw new Error(
        'Define the DB_NAME environment variable inside .env'
    );
};

let cached = global.mongodb;
if (!cached) {
    cached = global.mongodb = { conn: null, promise: null };
};

export let db: any;

export const initDb = async () => {
    if (cached.conn) {
        db = cached.conn.db;
        return cached.conn;
    };

    if (!cached.promise) {
        // Console attempt to connect
        console.log('\x1b[90m%s\x1b[0m', '--------------------------');
        consoleMessage('Attempt', 'initDb', 'Establishing new database connection');

        // const opts = {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // };

        cached.promise = MongoClient.connect(process.env.DB_CONN_STRING as string).then((client) => {
            return {
                client,
                db: client.db(process.env.DB_NAME)
            };
        });
    };

    try {
        cached.conn = await cached.promise;
        db = cached.conn.db;

        // Console a successful response
        consoleMessageResult(true, 'initDb', 'Connection with database established');
        console.log('\x1b[90m%s\x1b[0m', '--------------------------');

        return cached.conn;
    } catch (error: any) {
        // Console a negative response
        consoleMessageResult(false, 'initDb', 'Failed attempt to connect to MongoDb');
        console.log('');
        console.log('\x1b[35m%s\x1b[0m', '# Details:');
        console.error(error);
        console.log('\x1b[90m%s\x1b[0m', '--------------------------');

        return cached.conn;
    };
};