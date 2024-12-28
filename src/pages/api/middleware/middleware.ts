import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import jwt from 'jsonwebtoken';

const middleware = createRouter<NextApiRequest, NextApiResponse>();

export default middleware.use(async (req: any, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'Error', message: 'No Tokens are Provided' });
    jwt.verify(token, 'secretJwtRandom', (error: any, decoded: any) => {
        if (error) {
            return res.status(403).json({ status: 'Error', message: 'Invalid Token' });
        }
        if (typeof decoded === 'object') {
            req.user = decoded
            next();
        }
    });
});