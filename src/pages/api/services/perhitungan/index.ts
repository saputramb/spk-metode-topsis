import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { initModels } from '../../models/init-models';
import { DB } from '../../connection/database';
import middleware from '../../middleware/middleware';
import _ from 'lodash';

const models = initModels(DB)

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(middleware).get(async (req, res) => {
    const bobot = await models.alternatif.findAll({
        attributes: ['nis', 'kriteria', 'kategori']
    });

    const kriteria = await models.kriterium.findAll({
        attributes: ['kriteria', 'bobot', 'kode']
    });

    const kriteriaBobot = kriteria.reduce((acc: { [key: string]: any }, k) => {
        acc[k.kode] = k.bobot;
        return acc;
    }, {});

    const kategori = await models.kategori.findAll({
        attributes: ['kriteria', 'kategori', 'nilai']
    });

    const siswa = await models.siswa.findAll({
        attributes: ['nis', 'name']
    });

    const siswaDictionary = _.keyBy(siswa, 'nis');

    const join = bobot.map(item => {
        const kriteriaData = kriteria.find(kr => kr.kriteria === item.kriteria)
        const kategoriData = kategori.find(k => k.kriteria === item.kriteria && k.kategori === item.kategori);

        const student = siswaDictionary[item.nis];

        return {
            ...item.dataValues,
            nilai: kategoriData ? kategoriData.nilai : null,
            name: student ? student.name : null,
            kode: kriteriaData ? kriteriaData.kode : null,
        };
    });

    const groupedData = join.reduce((acc: { [key: string]: any }, currentValue) => {
        const { nis, kriteria, kategori, nilai, name, kode } = currentValue;

        if (!acc[nis]) {
            acc[nis] = { nis, name };
        }

        acc[nis][kriteria] = kategori;
        acc[nis][kode!] = nilai;

        return acc;
    }, {});

    const responseData = Object.values(groupedData);

    const resultAnalisa = responseData.map(item => _.mapKeys(item, (value, key) => _.camelCase(key)));

    const matrix = responseData.map((item) => {
        const dynamicColumns = Object.keys(item)
            .filter(key => key.startsWith('C'))
            .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

        return [
            item.nis,
            ...dynamicColumns.map(c => item[c] || null)
        ];
    });

    const criteriaMatrix = matrix.map(row => row.slice(1));

    const numRows = criteriaMatrix.length;
    const numCols = criteriaMatrix[0].length;

    const sumOfSquares = new Array(numCols).fill(0);
    for (let j = 0; j < numCols; j++) {
        for (let i = 0; i < numRows; i++) {
            sumOfSquares[j] += criteriaMatrix[i][j] ** 2;
        }
    }

    const normalizedResults = criteriaMatrix.map((row, index) => {
        const normalizedRow: any = {
            nis: matrix[index][0]
        };

        for (let j = 1; j <= numCols; j++) {
            normalizedRow[`c${j}`] = (row[j - 1] / Math.sqrt(sumOfSquares[j - 1])).toFixed(4);
        }

        return normalizedRow;
    });

    const normalizedTerbobotResults = normalizedResults.map(item => {
        const normalTerbobot: any = {};
        const studentName = siswaDictionary[item.nis] ? siswaDictionary[item.nis].name : null;

        Object.keys(item).forEach(krit => {
            if (krit !== 'nis') {
                const kriteriaCode = krit.toUpperCase();
                const bobotValue = kriteriaBobot[kriteriaCode];

                if (bobotValue) {
                    const nilaiNormalisasi = parseFloat(item[krit]);
                    if (!isNaN(nilaiNormalisasi)) {
                        normalTerbobot[krit] = (nilaiNormalisasi * bobotValue).toFixed(4);
                    }
                }
            }
        });

        return {
            name: studentName,
            nis: item.nis,
            ...normalTerbobot,
        };
    });

    const solusiIdealPositif: any = {};
    const solusiIdealNegatif: any = {};

    Object.keys(normalizedTerbobotResults[0]).forEach(kriteria => {
        if (kriteria !== 'nis' && kriteria !== 'name') {
            const nilaiKriteria = normalizedTerbobotResults.map(item => parseFloat(item[kriteria]));

            solusiIdealPositif[kriteria] = Math.max(...nilaiKriteria).toFixed(4);
            solusiIdealNegatif[kriteria] = Math.min(...nilaiKriteria).toFixed(4);
        }
    });

    const solusiIdeal = [
        {
            solusi: "Positif",
            ...solusiIdealPositif
        },
        {
            solusi: "Negatif",
            ...solusiIdealNegatif
        }
    ];

    const calculateDistance = (alternative: any, idealSolution: any) => {
        let distance = 0;
        Object.keys(idealSolution).forEach(kriteria => {
            if (kriteria !== 'nis' && kriteria !== 'name') {
                const nilai = parseFloat(alternative[kriteria]);
                const idealValue = parseFloat(idealSolution[kriteria]);
                distance += (nilai - idealValue) ** 2;
            }
        });
        return Math.sqrt(distance);
    };

    const calculatePreferenceScore = (distancePositive: number, distanceNegative: number) => {
        return distancePositive / (distancePositive + distanceNegative);
    };

    const resultWithDistancesAndPreference = normalizedTerbobotResults.map((item, index) => {
        const distanceToPositive = calculateDistance(item, solusiIdealPositif);
        const distanceToNegative = calculateDistance(item, solusiIdealNegatif);
        const preferenceScore = calculatePreferenceScore(distanceToPositive, distanceToNegative);

        return {
            nis: item.nis,
            name: item.name,
            distanceToPositive: distanceToPositive.toFixed(4),
            distanceToNegative: distanceToNegative.toFixed(4),
            preferenceScore: preferenceScore.toFixed(4),
        };
    });

    res.status(200).json({
        analisa: resultAnalisa,
        normalisasi: normalizedResults,
        normalTerbobot: normalizedTerbobotResults,
        solusiIdeal: solusiIdeal,
        jarakSolusiPreferensi: resultWithDistancesAndPreference,
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
