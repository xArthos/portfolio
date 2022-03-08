// Modules
import { IResolvers } from '@graphql-tools/utils';

// Resolvers
import { getUser } from './resolvers/userResolvers';

// Mutations
import { signUp } from './mutations/userMutations';

const resolvers: IResolvers = {
    Query: {
        user: getUser,
    },
    Mutation: {
        signUp: signUp
    }
};

export default resolvers;