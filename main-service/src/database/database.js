const { Pool } = require('pg')

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance
        }

        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'drinkflow',
            password: process.env.DB_PASSWORD || 'drinkflow123',
            database: process.env.DB_NAME || 'drinkflow'
        })

        this.pool.on('connect', () => {
            console.log('Conectado ao banco de dados PostgreSQL')
        })

        this.pool.on('error', (err) => {
            console.error('Erro no banco de dados:', err.message)
        })

        Database.instance = this
    }

    async waitForConnection(retries = 10, delay = 3000) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.pool.query('SELECT 1')
                console.log('Banco de dados pronto!')
                return
            } catch (err) {
                console.log(`Aguardando banco de dados... tentativa ${i + 1} de ${retries}`)
                await new Promise(res => setTimeout(res, delay))
            }
        }
        throw new Error('Não foi possível conectar ao banco de dados')
    }

    getConnection() {
        return this.pool
    }
}

module.exports = new Database()