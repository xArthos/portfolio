// Resolvers
import { getCurrentUser } from '../resolvers/userResolvers';

export type Context = {
    session: any; // TODO: set session types
    user: any; // TODO: set user types
};

/**
 * Generate apollo server context.
 * @constructor
 * @param {any} req - The request data sent to the server, it is necessary for getting headers and cookies.
 */
export const createContext = async ({ req }: { req: any }) => {
    const token = req.headers.authorization.split(' ')[1];
    
    const session = await getCurrentUser(undefined, token); // TODO: credentials not working on graphql studio (/api/graphql)

    return {
        session: { isAuth: true },
        user: session
    };
};