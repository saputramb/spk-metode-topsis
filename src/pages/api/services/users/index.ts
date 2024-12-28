import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels, userAttributes } from '../../models/init-models';
import { DB } from '../../connection/database';
import middleware from '../../middleware/middleware';
import { genSalt, hash } from 'bcryptjs';

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware).get(async (req, res) => {
    const result = await models.user.findAll({
        attributes: ['uniqueid', 'name', 'email', 'role']
    })
    res.status(200).json(result)
}).post(async (req, res) => {
    const payload: userAttributes = req.body;

    const result = await models.user.findOne({
        where: {
            email: payload.email,
        },
        attributes: ['email']
    })

    if (result?.email === payload.email) return res.status(400).json({
        status: 'Error',
        message: 'Email Has Been Registered'
    })

    if (payload.password !== req.body.confirmPassword) return res.status(400).json({
        status: 'Error',
        message: 'Password and confirm password are not the same'
    })

    const salt = await genSalt()
    const hashPassword = await hash(payload.password, salt)
    payload.password = hashPassword

    await models.user.create(payload)
    return res.status(201).json({
        status: 'Success',
        message: 'Account Successfully Registered'
    })
}).delete(async (req, res) => {
    await models.user.destroy({
        where: {
            uniqueid: req.body.uniqueid
        },
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Account Successfully Deleted'
    })
}).patch(async (req, res) => {
    const payload: userAttributes = req.body;

    if (payload.password !== req.body.confirmPassword) return res.status(400).json({
        status: 'Error',
        message: 'Password and confirm password are not the same'
    })

    const salt = await genSalt()
    const hashPassword = await hash(payload.password, salt)
    payload.password = hashPassword

    await models.user.update(payload, {
        where: {
            email: payload.email
        }
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Account Successfully Changed'
    })
})

export default router.handler({
    onError: (err: any, req, res) => {
        res.status(err.statusCode || 500).json({
            status: 'Error',
            message: err.message,
        });
    },
});