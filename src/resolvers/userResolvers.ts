// Modules
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

// Utils
import { db, initDb } from '../utils/mongoDb';

export const getCurrentUser = async (_root: undefined, { }: object, { user }: any) => {
    return user;
};

export const getUser = async (_root: undefined, { _id }: { _id: string }, { user, session }: any) => {
    // Reconnect mongoDb if is not connected
    if (!db) {
        await initDb();
    };
    console.log(user)

    try {
        const data = await db.collection('users').findOne({ _id: new ObjectId(_id) });

        return data;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        console.log('User Query attempt');
    };
};