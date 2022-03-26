// Modules
import cors from 'cors';
import * as http from 'http';
import express from 'express';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';

// GraphQl import
import schema from './schema';

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
    // process.env.CROSS_ORIGIN || '*',
    'http://localhost:3000',
    'https://studio.apollographql.com',
    'https://studio.apollographql.com/sandbox/explorer',
    'https://serverxarthos.vercel.app',
    'https://serverxarthos.vercel.app/graphql',
    'https://portfolio-server-lmohye3vr-xarthos.vercel.app'
];

// const startApolloServer = async (schema: any, createTestContext: any) => {
const startApolloServer = async (schema: any) => {
    const app: express.Application = (module.exports = express());
    const httpServer: http.Server = http.createServer(app);

    // mongoose.connect(process.env.DB_CONN_STRING, {
    //     useCreateIndex: true,
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // })

    // Create an Apollo server
    const server: ApolloServer<ExpressContext> = new ApolloServer({
        schema,
        // context: ({ req }) => {
        //   const token = req.headers.authorization;
        //   // TODO: #1 Finish the context
        //   const currentUser = User.getUserByToken(token);
        //   return { user: currentUser, User, Message }
        // },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ footer: false })
        ]
    });

    // Start the server
    await server.start();

    const corsOptions: cors.CorsOptions = {
        origin: true,
        // methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        // allowedHeaders: ['Content-Type'],
        // preflightContinue: false,
        // credentials: true,
        // optionsSuccessStatus: 204,
        // maxAge: 84600
    };

    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: corsOptions
    });

    // App Config
    // app.use(cors(corsOptions));
    // app.use(express.json());
    app.use('/graphql', (req, res, next) => {
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        // res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    // Routes
    app.get(`*`, async (req, res) => {
        console.log(req)
        const data = getUser(undefined, { _id: '623222d2826ad9c729d5fb1e' });

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