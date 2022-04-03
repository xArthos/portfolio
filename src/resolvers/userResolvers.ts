// Modules
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

// Utils
import { db, initDb } from '../utils/mongoDb';

export const getUser = async (_root: any, { _id }: any, _context: any) => {
    // Reconnect mongoDb if is not connected
    if (!db) {
        await initDb();
    };

    console.log(_context);
    // console.log(db);

    try {
        const data = await db.collection('users').findOne({ _id: new ObjectId(_id) });
        console.log(data);
        return data;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        console.log('User Query attempt');
    };
};