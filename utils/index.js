import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
const secretKey = process.env.SECRET_KEY

const token = {
    generateToken: (userData) => {
        return jwt.sign(userData, secretKey, {
            expiresIn: '1h'
        });
    },
    verifyToken: (token) => {
        return jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err.message);
                throw new Error(err.message);
            } else {
                return decoded;
            }
        });
    }
}

export default token
    
