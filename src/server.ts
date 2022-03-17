// Modules
import cors from 'cors';
import * as http from 'http';
import express from 'express';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginInlineTrace
} from 'apollo-server-core';

// GraphQl import
import schema from './schema';

// Utils
import { initDb } from './utils/mongoDb';
import { consoleMessage, consoleMessageResult } from './utils/consoleMessage';

// Config
import 'dotenv/config';

// const processContext = async ({ req, res }: { req: any, res: any }) => ({ res });

// const startApolloServer = async (schema: any, createTestContext: any) => {
const startApolloServer = async (schema: any) => {
  const app: express.Application = (module.exports = express());
  const httpServer: http.Server = http.createServer(app);

  // Connect to MongoDb
  await initDb();

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
      ApolloServerPluginInlineTrace(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: "my-graph-id@Graph-Portfolio",
          footer: false
        })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false })
    ]
  });

  // Add a list of allowed origins.
  // If you have more origins you would like to add, you can add them to the array below.
  const allowedOrigins = [process.env.CROSS_ORIGIN || 'http://localhost:3000', 'https://studio.apollographql.com'];

  const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  // Routes
  app.get(`/foo`, (req, res) => res.send(`hey`));

  // Run the server
  consoleMessage('Server', 'startApolloServer', `Attempt to run server`);

  await server.start();
  server.applyMiddleware({ app, cors: false });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));

  // Console a successfully response
  consoleMessageResult(true, 'startApolloServer', `🚀 Server ready at`);
  console.log('\x1b[34m%s\x1b[0m', `http://localhost:4000${server.graphqlPath}`);
  console.log('\x1b[90m%s\x1b[0m', '--------------------------');
};

// Start the server
startApolloServer(schema);
// startApolloServer(schema, context);