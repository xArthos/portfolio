// Modules
import { IResolvers } from '@graphql-tools/utils';

// Resolvers
import { getUser, getCurrentUser } from './resolvers/userResolvers';

// Mutations
import { signUp, login } from './mutations/userMutations';

const resolvers: IResolvers = {
    Query: {
        user: getUser,
        currentUser: getCurrentUser
    },
    Mutation: {
        signUp: signUp,
        logIn: login
    }
};

export default resolvers;