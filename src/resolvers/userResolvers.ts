// Modules
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

// Utils
import { db } from '../utils/mongoDb';

export const getUser = async (_: any, { _id }: any) => {
    console.log(_id)
    try {
        return await db.collection('users').findOne({ _id: new ObjectId(_id) });;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        console.log('User Query attempt');
    };
};