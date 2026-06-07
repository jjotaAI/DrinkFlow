const db = require('../database/database').getConnection()
const Produto = require('../models/produtoModel')

class ProdutoRepository {
    async findAll() {
        const { rows } = await db.query('SELECT * FROM produtos ORDER BY id')
        return rows.map(row => new Produto(row))
    }

    async findById(id) {
        const { rows } = await db.query('SELECT * FROM produtos WHERE id = $1', [id])
        if (rows.length === 0) return null
        return new Produto(rows[0])
    }

    async create(nome, descricao, preco, quantidade_estoque) {
        const { rows } = await db.query(
            'INSERT INTO produtos (nome, descricao, preco, quantidade_estoque) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, descricao, preco, quantidade_estoque]
        )
        return new Produto(rows[0])
    }

    async update(id, nome, descricao, preco, quantidade_estoque) {
        const { rows } = await db.query(
            'UPDATE produtos SET nome = $1, descricao = $2, preco = $3, quantidade_estoque = $4 WHERE id = $5 RETURNING *',
            [nome, descricao, preco, quantidade_estoque, id]
        )
        if (rows.length === 0) return null
        return new Produto(rows[0])
    }

    async delete(id) {
        const { rows } = await db.query(
            'DELETE FROM produtos WHERE id = $1 RETURNING *',
            [id]
        )
        return rows.length > 0
    }

    async updateEstoque(id, quantidade) {
        const { rows } = await db.query(
            'UPDATE produtos SET quantidade_estoque = quantidade_estoque + $1 WHERE id = $2 RETURNING *',
            [quantidade, id]
        )
        if (rows.length === 0) return null
        return new Produto(rows[0])
    }
}

module.exports = new ProdutoRepository()