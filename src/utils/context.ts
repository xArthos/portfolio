// Modules
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { ApolloError, AuthenticationError } from 'apollo-server-express';

// Utils
import { db, initDb } from './mongoDb';

// Config
import 'dotenv/config';

export type Context = {
    session: any; // TODO: set session types
    user: any; // TODO: set user types
};

const getUser = async (token: string) => {
    // Reconnect mongoDb if is not connected
    if (!db) {
        await initDb();
    };

    // console.log(token)

    // Todo: add a jwt token that verify the user login session and data
    const id: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secretTesting', (err, userTokenData) => {
        if (err) {
            // console.log(err);
            return;
        };

        return userTokenData;
    });

    console.log(id)

    try {
        if (!id) return;
        const user = await db.collection('users').findOne({ _id: new ObjectId(id.userId) });

        return user;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        console.log('Context attempt');
    };
};

/**
 * Generate apollo server context.
 * @constructor
 * @param {any} req - The request data sent to the server, it is necessary for getting headers and cookies.
 */
export const createContext = async ({ req, res }: { req: any, res: any }) => {
    const token = 
    req && req.cookies && req.cookies.devArthosPortfolio ||
    req && req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1];

    console.log(req && req.headers && req.headers.authorization)

    try {
        if (!token) {
            return {
                res,
                session: { isAuth: false },
                user: undefined
            }
        };

        const user = await getUser(token); // TODO: credentials not working on graphql studio (/api/graphql)

        if (!user) {
            return {
                res,
                session: { isAuth: false },
                user: undefined
            }
        };

        return {
            res,
            session: { isAuth: true },
            user: user
        };
    } catch (error) {
        // console.log(error)
        return {
            res,
            session: { isAuth: false },
            user: undefined
        };
    }
};