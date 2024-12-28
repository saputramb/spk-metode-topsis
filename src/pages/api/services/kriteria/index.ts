import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels, kriteriumAttributes } from '../../models/init-models';
import { DB } from '../../connection/database';
import middleware from '../../middleware/middleware';

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware).get(async (req, res) => {
    const result = await models.kriterium.findAll({
        attributes: ['uniqueid', 'kriteria', 'bobot', 'kode'],
        order: [
            ['kode', 'ASC']
        ]
    })
    res.status(200).json(result)
}).post(async (req, res) => {
    const payload: kriteriumAttributes = req.body

    const result = await models.kriterium.findOne({
        where: {
            kriteria: payload.kriteria
        },
        attributes: ['kriteria']
    })

    if (result?.kriteria === payload.kriteria) return res.status(400).json({
        status: 'Error',
        message: 'Kriteria Sudah Ada'
    })

    await models.kriterium.create(payload)
    return res.status(201).json({
        status: 'Success',
        message: 'Kriteria Berhasil Ditambahkan'
    })
}).delete(async (req, res) => {
    await models.kriterium.destroy({
        where: {
            uniqueid: req.body.uniqueid
        },
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Kriteria Berhasil Dihapus'
    })
}).patch(async (req, res) => {
    const payload: kriteriumAttributes = req.body

    await models.kriterium.update(payload, {
        where: {
            uniqueid: req.body.uniqueid
        }
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Kriteria Berhasil Diubah'
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