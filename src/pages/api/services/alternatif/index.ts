import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels } from '../../models/init-models';
import { DB } from '../../connection/database';
import middleware from '../../middleware/middleware';
import _ from "lodash";

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware).get(async (req, res) => {
    const bobot = await models.alternatif.findAll({
        attributes: ['nis', 'kriteria', 'kategori']
    })

    const siswa = await models.siswa.findAll({
        attributes: ['nis', 'name']
    });

    const siswaDictionary = _.keyBy(siswa, 'nis');

    const join = bobot.map(item => {
        const student = siswaDictionary[item.nis];

        return {
            ...item.dataValues,
            name: student ? student.name : null,
        };
    });

    const groupedData = join.reduce((acc: { [key: string]: any }, currentValue) => {
        const { nis, kriteria, kategori, name } = currentValue;

        if (!acc[nis]) {
            acc[nis] = { nis, name };
        }

        acc[nis][kriteria] = kategori;

        return acc;
    }, {});

    const responseData = Object.values(groupedData);

    const result = responseData.map(item => _.mapKeys(item, (value, key) => _.camelCase(key)));

    res.status(200).json(result);
}).post(async (req, res) => {
    const keys = Object.keys(req.body);
    let result: any[] = []

    const siswa = await models.alternatif.findOne({
        where: {
            nis: req.body.nis
        },
        attributes: ['nis']
    })

    if (siswa?.nis === req.body.nis) return res.status(400).json({
        status: 'Error',
        message: 'Bobot Siswa Sudah Ada'
    })

    for (const key of keys) {
        if (key !== 'siswa' && key !== 'nis' && key !== 'name') {
            result.push({
                nis: req.body.nis,
                kriteria: _.startCase(key),
                kategori: req.body[key]
            });
        }
    }

    await models.alternatif.bulkCreate(result)
    return res.status(201).json({
        status: 'Success',
        message: 'Bobot Siswa Berhasil Ditambahkan'
    })
}).patch(async (req, res) => {
    const keys = Object.keys(req.body);
    let result: any[] = []

    for (const key of keys) {
        if (key !== 'siswa' && key !== 'nis' && key !== 'name') {
            result.push({
                nis: req.body.nis,
                kriteria: _.startCase(key),
                kategori: req.body[key]
            });
        }
    }

    const updatePromise = result.map(async (data) => {
        await models.alternatif.update({ kategori: data.kategori }, {
            where: {
                nis: data.nis,
                kriteria: data.kriteria,
            }
        })
    })

    await Promise.all(updatePromise)

    return res.status(200).json({
        status: 'Success',
        message: 'Bobot Siswa Berhasil Diubah'
    })
}).delete(async (req, res) => {
    await models.alternatif.destroy({
        where: {
            nis: req.body.nis
        },
    })
    return res.status(200).json({
        status: 'Success',
        message: 'Bobot Siswa Berhasil Dihapus'
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