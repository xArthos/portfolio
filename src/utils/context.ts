// Modules
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { ApolloError, AuthenticationError } from 'apollo-server-express';

// Utils
import { db, initDb } from './mongoDb';
import { consoleMessage, consoleMessageResult } from './consoleMessage';

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

    // Todo: add a jwt token that verify the user login session and data
    consoleMessage('Server Context', 'verifyToken', `token verification`);
    const id: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secretTesting', (err, userTokenData) => {
        if (err) {
            consoleMessageResult(false, 'verifyToken', err.message);
            return;
        };

        consoleMessageResult(true, 'verifyToken', 'Token successfully verified');
        return userTokenData;
    });

    try {
        if (!id) return;
        const user = await db.collection('users').findOne({ _id: new ObjectId(id.userId) });

        consoleMessageResult(true, 'verifyToken', 'User retrieved from token data');
        return user;
    } catch (error: any) {
        consoleMessageResult(false, 'Fetch user', 'Couldn\'t fetch the logged user');
        throw new ApolloError(error);
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
        // console.log(req.cookies);

    try {
        if (!token) {
            return {
                res,
                session: { isAuth: false },
                user: undefined
            }
        };

        console.log('\x1b[90m%s\x1b[0m', '--------------------------');
        const user = await getUser(token);
        console.log('\x1b[90m%s\x1b[0m', '--------------------------');

        if (user) {
            return {
                res,
                session: { isAuth: true },
                user: user
            }
        };

        return {
            res,
            session: { isAuth: false },
            user: undefined
        };
    } catch (error) {
        return {
            res,
            session: { isAuth: false },
            user: undefined
        };
    };
};