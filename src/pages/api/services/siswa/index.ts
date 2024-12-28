import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels, siswaAttributes } from '../../models/init-models';
import { DB } from '../../connection/database';
import middleware from '../../middleware/middleware';

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware).get(async (req, res) => {
    const result = await models.siswa.findAll({
        attributes: ['uniqueid', 'nis', 'name', 'kelas']
    })
    res.status(200).json(result)
}).post(async (req, res) => {
    const payload: siswaAttributes = req.body

    const result = await models.siswa.findOne({
        where: {
            nis: payload.nis
        },
        attributes: ['nis']
    })

    if (result?.nis === payload.nis) return res.status(400).json({
        status: 'Error',
        message: 'Nomor Induk Siswa / Siswa Sudah Terdaftar'
    })

    await models.siswa.create(payload)
    return res.status(201).json({
        status: 'Success',
        message: 'Data Siswa Berhasil Ditambahkan'
    })
}).delete(async (req, res) => {
    await models.siswa.destroy({
        where: {
            uniqueid: req.body.uniqueid
        },
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Data Siswa Berhasil Dihapus'
    })
}).patch(async (req, res) => {
    const payload: siswaAttributes = req.body

    await models.siswa.update(payload, {
        where: {
            nis: payload.nis
        }
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Data Siswa Berhasil Diubah'
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