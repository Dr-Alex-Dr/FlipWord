import mysql, { Pool } from 'mysql2';
import 'dotenv/config'

export class InitializeDatabase {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE,
            password: process.env.MYSQL_PASSWORD,
        });
    }

    connect(sqlQuery: string, sqlParams?: (string | number | null)[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool.promise().execute(sqlQuery, sqlParams)
                .then(([rows]) => {
                    resolve(rows);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

