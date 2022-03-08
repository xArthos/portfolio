// Modules
import * as http from 'http';
import express from 'express';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

// GraphQl import
import schema from './schema';

// Utils
import { initDb } from './utils/mongoDb';

// Config
import 'dotenv/config';

const startApolloServer = async (schema: any) => {
  const app: express.Application = express();
  const httpServer: http.Server = http.createServer(app);

  await initDb();

  // Create an Apollo server
  const server: ApolloServer<ExpressContext> = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ]
  });

  // Routes
  app.get(`/foo`, (req, res) => res.send(`hey`));

  // Run the server
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

// Start the server
startApolloServer(schema);