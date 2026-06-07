const { Pool } = require('pg');

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            user: process.env.DB_USER || 'drinkflow',
            password: process.env.DB_USER_PASSWORD || 'drinkflow123',
            database: process.env.DB_NAME || 'drinkflow'
        });

        this.pool.on('connect', () => {
            console.log('Conectado ao banco de dados PostgreSQL');
        });

        this.pool.on('error', (err) => {
            console.log(`Erro no banco de dados: ${err.message}`);
        });

        Database.instance = this;
    }

    getConnection() {
        return this.pool;
    }
}

module.exports = new Database();