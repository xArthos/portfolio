// Modules
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DateTime } from "luxon";
import { ObjectId } from 'mongodb';
import {
    ForbiddenError,
    UserInputError,
    AuthenticationError
} from 'apollo-server-errors';

// Utils
import { db } from '../utils/mongoDb';

// Config
import 'dotenv/config';

const authorizationHeader = (userId: ObjectId, ctx: { res: { setHeader: (arg0: string, arg1: string) => void; }; }) => {
    const token = createToken(userId);

    try {
        ctx.res.setHeader(
            'Set-Cookie',
            // `devArthosPortfolio=${token}; SameSite=None; Secure`,
            `devArthosPortfolio=${token}; Max-Age=315360000; Path=/; SameSite=Secure; HttpOnly${process.env.NODE_ENV !== 'development' ? '; Secure' : ''}`
        );
    } catch (error) {
        console.log(error);
    };

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
    const user = await db.collection('users').findOne({ 'email.current': email });
    if (!user) throw new AuthenticationError('wrong credentials');

    // const valid = await bcrypt.compare(password, user.password.hash);
    // if (!valid) throw new AuthenticationError('wrong credentials');

    const token = authorizationHeader(user._id, ctx);

    // await db
    //     .collection('users')
    //     .updateOne({ _id: user._id }, { $set: { token: token } });

    return token;
};