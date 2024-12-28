import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels, kategoriAttributes } from '../../models/init-models';
import { DB } from '../../connection/database';
import middleware from '../../middleware/middleware';

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware).get(async (req, res) => {
    const result = await models.kategori.findAll({
        attributes: ['uniqueid', 'kriteria', 'kategori', 'nilai'],
        order: [
            ['kriteria', 'ASC'],
            ['nilai', 'ASC']
        ]
    })
    res.status(200).json(result)
}).post(async (req, res) => {
    const payload: kategoriAttributes = req.body

    await models.kategori.create(payload)
    return res.status(201).json({
        status: 'Success',
        message: 'Kategori Berhasil Ditambahkan'
    })
}).delete(async (req, res) => {
    await models.kategori.destroy({
        where: {
            uniqueid: req.body.uniqueid
        },
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Kategori Berhasil Dihapus'
    })
}).patch(async (req, res) => {
    const payload: kategoriAttributes = req.body

    await models.kategori.update(payload, {
        where: {
            uniqueid: req.body.uniqueid
        }
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Kategori Berhasil Diubah'
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