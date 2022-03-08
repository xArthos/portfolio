// Modules
import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

// GraphQl Imports
import resolvers from './resolvers';
import * as typeDefs from './graphql/user.graphql';

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;