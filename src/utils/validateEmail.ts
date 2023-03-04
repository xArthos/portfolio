// Modules
import validate from 'deep-email-validator';

const validateEmail = async (email: string) => {
    const res = await validate(email);

    if (res.valid) {
        return {
            valid: true,
            reason: res.reason
        }
    } else {
        return {
            valid: false,
            reason: res.reason
        };
    };
};

export default validateEmail;