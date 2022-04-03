// Modules
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

// Utils
import { db, initDb } from '../utils/mongoDb';

export const getCurrentUser = async (_root: any, token: any) => {
    // Reconnect mongoDb if is not connected
    if (!db) {
        await initDb();
    };
    console.log(token)

    const id = token;
    // Todo: add a jwt token that verify the user loggin session and data

    try {
        const data = await db.collection('users').findOne({ _id: new ObjectId(id) });

        return data;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        // console.log('Context attempt');
    };
};

export const getUser = async (_root: any, { _id }: { _id: string}, _context: any) => {
    // Reconnect mongoDb if is not connected
    if (!db) {
        await initDb();
    };

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