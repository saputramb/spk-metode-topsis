import { Sequelize } from "sequelize";

export const DB = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'SKRIPSI_TOPSIS',
    username: 'postgres',
    password: 'kroncongprotokol',
    dialectOptions: {
        statement_timeout: 1000,
        idle_in_transaction_session_timeout: 5000
    }
});