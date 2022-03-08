// Modules
import { ApolloError } from 'apollo-server-express';

export const getUser = async () => {
    try {
        const test = {
            _id: '#asdasdas',
            name: {
                firstName: 'Giampaolo',
                secondName: 'Nico',
                lastName: 'Lo Cascio',
                fullName: 'Porcoddio'
            },
            nickname: 'Arthos',
            type: 'user',
            email: {
                currentEmail: 'porcoddio@dio.porco',
                isVerified: true,
                oldEmails: [
                    'porcamadonna@madonna.puttana'
                ]
            },
            avatar: {
                source: 'dio.png',
                blockAvatar: {
                    color: '#492359'
                }
            }
        };

        return test;
    } catch (error: any) {
        throw new ApolloError(error);
    } finally {
        console.log('User Query attempt');
    };
};