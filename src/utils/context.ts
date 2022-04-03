export type Context = {
    session: any; // TODO: set session types
};

/**
 * Generate apollo server context.
 * @constructor
 * @param {any} req - The request data sent to the server, it is necessary for getting headers and cookies.
 */
export const createContext = async ({ req }: { req: any }) => {
    console.log(req.headers)
    //   const session = await getSession({ req }); // TODO: credentials not working on graphql studio (/api/graphql)
    return {
        session: { isAuth: true }
    };
};