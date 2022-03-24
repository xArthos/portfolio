// Modules
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

// Utils
import { db, initDb } from '../utils/mongoDb';

export const getUser = async (_: any, { _id }: any) => {
    console.log(_id)
    console.log(db)
    if (!db) {
        await initDb();
    };

    console.log(db)

    try {
        return await db.collection('users').findOne({ _id: new ObjectId(_id ? _id : '623222d2826ad9c729d5fb1e') });;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        console.log('User Query attempt');
    };
};