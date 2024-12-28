import { createRouter } from 'next-connect';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels } from '../../models/init-models';
import { DB } from '../../connection/database';

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
    /* Get Post Data */
    const { email, password } = req.body;
    /* Any how email or password is blank */
    if (!email || !password) {
        return res.status(400).json({
            status: 'Error',
            message: 'Request missing username or password',
        });
    }
    /* Check user in database */
    const user = await models.user.findOne({
        where: { email: email },
        attributes: ['uniqueid', 'name', 'email', 'password', 'role'],
        limit: 1,
    });
    /* Check if exists */
    if (!user) {
        res.status(400).json({ status: 'Error', message: 'User Not Found' });
    }
    /* Define variables */
    const userId = user!.uniqueid,
        userName = user!.name,
        userEmail = user!.email,
        userPassword = user!.password,
        userRole = user!.role;
    /* Check and compare password */
    bcrypt.compare(password, userPassword).then(isMatch => {
        if (isMatch) {
            /* User matched */
            /* Create JWT Payload */
            const payload = {
                uniqueid: userId,
                name: userName,
                email: userEmail,
                role: userRole,
            };
            /* Sign token */
            jwt.sign(
                payload,
                'secretJwtRandom',
                {
                    expiresIn: 3600,
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                },
                (err, token) => {
                    res.status(200).json({
                        status: 'Success',
                        message: 'Login Successfully',
                        token: token,
                    });
                },
            );
        } else {
            res.status(400).json({ status: 'Error', message: 'Password incorrect' });
        }
    });
});

export default router.handler({
    onError: (err: any, req, res) => {
        res.status(err.statusCode || 500).json({
            status: 'Error',
            message: err.message,
        });
    },
});