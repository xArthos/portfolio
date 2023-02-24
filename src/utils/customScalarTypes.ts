// Modules
import { Kind } from 'graphql/language';
import { ObjectId } from 'mongodb';
import { GraphQLError } from 'graphql';
import { GraphQLScalarType } from 'graphql';

// Data
import validateEmail from './validateEmail';

const testPassword = (value: string) => {
    if (value.length < 5) throw new GraphQLError('Password is too short');
    if (value.length > 40) throw new GraphQLError('Password is too long');
    if (/\s/.test(value)) throw new GraphQLError('Password should not contains white spaces');
};

export const ObjectIdScalar = new GraphQLScalarType({
    name: 'ObjectId',
    description: 'mongo Object Id',

    // Server -> Client
    serialize(value: any) {
        if (!(value instanceof ObjectId))
            throw new GraphQLError('invalid objectId');

        return value.toString();
    },

    // Client -> Server (as json)
    parseValue(value: any) {
        if (!ObjectId.isValid(value)) throw new GraphQLError('invalid objectId');

        return new ObjectId(value);
    },

    // Client -> Server (as string)
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) throw new GraphQLError('invalid objectId');

        const value = ast.value.toString();
        return new ObjectId(value);
    }
});

export const EmailScalar = new GraphQLScalarType({
    name: 'Email',
    description: 'valid email',

    // Server -> Client
    serialize(value) {
        return value;
    },

    // Client -> Server (as json)
    parseValue(value) {
        if (typeof value !== 'string' || !validateEmail(value))
            throw new GraphQLError('a@b.c');

        return value.trim().toLowerCase();
    },

    // Client -> Server (as string)
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) throw new GraphQLError('a@b.c');

        const value = ast.value.toString();
        if (!validateEmail(value)) throw new GraphQLError('a@b.c');

        return value.trim().toLowerCase();
    }
});

export const PasswordScalar = new GraphQLScalarType({
    name: 'Password',
    description: 'valid password',

    // Server -> Client
    serialize(value) {
        return value;
    },

    // Client -> Server (as json)
    parseValue(value) {
        if (typeof value !== 'string') throw new GraphQLError('invalid password');

        testPassword(value);
        return value.trim();
    },

    // Client -> Server (as string)
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) throw new GraphQLError('invalid password');

        const value = ast.value.toString();
        testPassword(value);
        return value.trim();
    }
});