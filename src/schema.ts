// Modules
import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

// GraphQl Imports
import resolvers from './resolvers';
import * as userTypeDefs from './graphql/user.graphql';
import * as scalarTypeDefs from './graphql/scalarTypes.graphql';

const modules = [
    userTypeDefs,
    scalarTypeDefs
];

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: modules.map(schema => schema),
    resolvers
});

export default schema;