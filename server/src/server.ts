// Modules
import * as http from 'http';
import express from 'express';
import { MongoClient } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

const typeDefs = gql`
  type Query {
    getNums: Int
  }
`;

const resolvers = {
  Query: {
    getNums: () => 1
  }
};

const startApolloServer = async (typeDefs, resolvers) => {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });

    app.get(`/foo`, (req, res) => res.send(`hey`));

    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)