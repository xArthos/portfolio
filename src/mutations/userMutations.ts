// Modules
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DateTime } from "luxon";
import { ObjectId } from 'mongodb';
import { GraphQLError } from 'graphql';

// Utils
import { db, initDb } from '../utils/mongoDb';
import { consoleMessage, consoleMessageResult } from '../utils/consoleMessage';

// Config
import 'dotenv/config';

const authorizationHeader = (userId: ObjectId, ctx: { res: { setHeader: (arg0: string, arg1: string) => void; }; }) => {
    const token = createToken(userId);

    try {
        console.log('\x1b[36m%s\x1b[0m', '-------------');
        consoleMessage('Mutations Inner Task', 'set response cookie', `Attempt to create a token for authorization`);
        ctx.res.setHeader(
            'Set-Cookie',
            // `devArthosPortfolio=${token}; SameSite=None; Secure`,
            `devArthosPortfolio=${token}; Max-Age=7200; Path=/graphql; SameSite=Secure; HttpOnly${process.env.NODE_ENV !== 'development' ? '; Secure' : ''}`
        );
        consoleMessageResult(true, 'set response cookie', 'cookie successfully created');
        console.log('\x1b[36m%s\x1b[0m', '-------------');
    } catch (error) {
        consoleMessageResult(false, 'set response cookie', 'error during the creation of the cookie');
        console.log(error);
        console.log('\x1b[36m%s\x1b[0m', '-------------');
    };

    if (token) { consoleMessageResult(true, 'authorizationHeader', 'Authorization successfully created'); }
    else { consoleMessageResult(false, 'authorizationHeader', 'Error during the creation of an authorization'); }
    return token;
};

const createToken = (userId: ObjectId) => {
    return userId && jwt.sign({ userId: userId.toString() }, process.env.ACCESS_TOKEN_SECRET || 'secretTesting', { expiresIn: '10s' });
};

export const signUp = async (
    _: any,
    { name, nickname, password, email, avatar }: { name: any, nickname: string, password: string, email: string, avatar: any },
    ctx: any
) => {
    if (!db) {
        await initDb();
    };

    const randColor = () => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    };

    const user = {
        _id: new ObjectId(),
        email: {
            current: email,
            isVerified: false,
            oldEmails: []
        },
        // password: await bcrypt.hash(password, 11),
        password: password,
        nickname: nickname,
        name: {
            firstName: name.firstName.trim(),
            secondName: name.secondName && name.secondName.trim(),
            lastName: name.lastName.trim()
        },
        createdAt: DateTime.now().setZone('system').toISO(),
        type: 'user',
        avatar: {
            source: avatar?.source,
            blockAvatar: {
                color: randColor(),
                bgColor: randColor(),
                spotColor: randColor()
            }
        }
    };

    await db.collection('users').insertOne(user);
    const token = authorizationHeader(user._id, ctx);

    return token;
};

export const login = async (_: any, { email, password }: { email: string, password: string }, ctx: any) => {
    if (!db) {
        await initDb();
    };
    // console.log(db);

    const user = await db.collection('users').findOne({ 'email.current': email });
    if (!user) throw new GraphQLError('wrong credentials', {
        extensions: {
            code: 'UNAUTHENTICATED',
            myExtension: "foo",
        },
    });

    // const valid = await bcrypt.compare(password, user.password.hash);
    // if (!valid) throw new AuthenticationError('wrong credentials');

    console.log('\x1b[90m%s\x1b[0m', '--------------------------');
    consoleMessage('Mutations Task', 'authorizationHeader', `Attempt to create authorization`);
    const token = authorizationHeader(user._id, ctx);
    console.log('\x1b[90m%s\x1b[0m', '--------------------------');

    return token;
};