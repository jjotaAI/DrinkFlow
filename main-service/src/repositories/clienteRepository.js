const db = require('../database/database').getConnection()
const Cliente = require('../models/clienteModel')

class ClienteRepository {
    async findAll() {
        const { rows } = await db.query('SELECT * FROM clientes ORDER BY id')
        return rows.map(row => new Cliente(row))
    }

    async findById(id) {
        const { rows } = await db.query('SELECT * FROM clientes WHERE id = $1', [id])
        if (rows.length === 0) return null
        return new Cliente(rows[0])
    }

    async create(nome, email, telefone) {
        const { rows } = await db.query(
            'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, telefone]
        )
        return new Cliente(rows[0])
    }

    async update(id, nome, email, telefone) {
        const { rows } = await db.query(
            'UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
            [nome, email, telefone, id]
        )
        if (rows.length === 0) return null
        return new Cliente(rows[0])
    }

    async delete(id) {
        const { rows } = await db.query(
            'DELETE FROM clientes WHERE id = $1 RETURNING *',
            [id]
        )
        return rows.length > 0
    }
}

module.exports = new ClienteRepository()