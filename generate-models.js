const SequelizeAuto = require("sequelize-auto");

const GENERATE_MODELS_AUTH = new SequelizeAuto(
    'SKRIPSI_TOPSIS',
    'postgres',
    'kroncongprotokol',
    {
        host: 'localhost',
        dialect: 'postgres',
        directory: "./src/pages/api/models",
        port: 5432,
        caseFile: "c",
        // caseModel: "c",
        // caseProp: "c",
        singularize: true,
        spaces: true,
        indentation: 2,
        additional: {
            timestamps: false,
            // ...options added to each model
        },
        lang: 'ts',
        useDefine: true
    },
);

GENERATE_MODELS_AUTH.run();