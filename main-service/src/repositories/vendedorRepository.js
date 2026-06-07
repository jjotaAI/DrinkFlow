const db = require('../database/database').getConnection()
const Vendedor = require('../models/vendedorModel')

class VendedorRepository {
    async findAll() {
        const { rows } = await db.query('SELECT * FROM vendedores ORDER BY id')
        return rows.map(row => new Vendedor(row))
    }

    async findById(id) {
        const { rows } = await db.query('SELECT * FROM vendedores WHERE id = $1', [id])
        if (rows.length === 0) return null
        return new Vendedor(rows[0])
    }

    async create(nome, email, telefone) {
        const { rows } = await db.query(
            'INSERT INTO vendedores (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, telefone]
        )
        return new Vendedor(rows[0])
    }

    async update(id, nome, email, telefone) {
        const { rows } = await db.query(
            'UPDATE vendedores SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
            [nome, email, telefone, id]
        )
        if (rows.length === 0) return null
        return new Vendedor(rows[0])
    }

    async delete(id) {
        const { rows } = await db.query(
            'DELETE FROM vendedores WHERE id = $1 RETURNING *',
            [id]
        )
        return rows.length > 0
    }
}

module.exports = new VendedorRepository()