// Modules
import bcrypt from 'bcryptjs';
import { DateTime } from "luxon";
import { ObjectId } from 'mongodb';

// Utils
import { db } from '../utils/mongoDb';

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

    return user;
};