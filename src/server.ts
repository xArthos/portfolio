// Modules
import cors from 'cors';
import * as http from 'http';
import express from 'express';
import sessions from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';

// GraphQl import
import schema from './schema';
import { createContext } from './utils/context';

// Utils
import { initDb } from './utils/mongoDb';
import { consoleMessage, consoleMessageResult } from './utils/consoleMessage';

// Data
import { getUser } from './resolvers/userResolvers';

// Config
import 'dotenv/config';

// const processContext = async ({ req, res }: { req: any, res: any }) => ({ res });

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = [
    'http://localhost:3000',
    'https://studio.apollographql.com',
    'https://arthos-portfolio.vercel.app'
];

const oneDay = 1000 * 60 * 60 * 24;

// const startApolloServer = async (schema: any, createTestContext: any) => {
const startApolloServer = async (schema: any) => {
    const app: express.Application = (module.exports = express());
    const httpServer: http.Server = http.createServer(app);

    // Create an Apollo server
    const server: ApolloServer<ExpressContext> = new ApolloServer({
        schema,
        context: createContext,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ footer: false })
        ]
    });

    // Start the server
    await server.start();

    const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins,
        // methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        // allowedHeaders: ['Content-Type'],
        // preflightContinue: false,
        credentials: true,
        // optionsSuccessStatus: 204,
        // maxAge: 84600
    };

    // App Config
    app.use(sessions({
        secret: process.env.SESSION_SECRET || 'sessionSecretTest',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: oneDay,
            secure: false,
            sameSite: 'none'
        }
    }));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    app.use(express.json());

    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: corsOptions
    });

    // Routes
    app.get(`/`, async (req, res) => {
        console.log(req)
        const data = getUser(undefined, { _id: '623222d2826ad9c729d5fb1e' }, { user: undefined, session: { isAuth: false } });

        return res.status(200).send(await data);
    });

    // Connect to MongoDb
    await initDb();

    // Start the Http Server
    consoleMessage('Server', 'startApolloServer', `Attempt to run server`);
    // await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    await new Promise<void>(resolve => app.listen({ port: 4000 }, resolve));

    // Console a successfully response
    consoleMessageResult(true, 'startApolloServer', `🚀 Server ready at`);
    console.log('\x1b[34m%s\x1b[0m', `http://localhost:4000${server.graphqlPath}`);
    console.log('\x1b[90m%s\x1b[0m', '--------------------------');
};

// Start the server
startApolloServer(schema);
// startApolloServer(schema, context);