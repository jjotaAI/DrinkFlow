const db = require('../database/database').getConnection()
const Venda = require('../models/vendaModel')

class VendaRepository {
    async findAll() {
        const { rows } = await db.query(`
      SELECT v.*, 
        json_agg(json_build_object(
          'id', iv.id,
          'produto_id', iv.produto_id,
          'quantidade', iv.quantidade,
          'preco_unitario', iv.preco_unitario
        )) as itens
      FROM vendas v
      LEFT JOIN itens_venda iv ON iv.venda_id = v.id
      GROUP BY v.id
      ORDER BY v.id
    `)
        return rows.map(row => new Venda(row))
    }

    async findById(id) {
        const { rows } = await db.query(`
      SELECT v.*, 
        json_agg(json_build_object(
          'id', iv.id,
          'produto_id', iv.produto_id,
          'quantidade', iv.quantidade,
          'preco_unitario', iv.preco_unitario
        )) as itens
      FROM vendas v
      LEFT JOIN itens_venda iv ON iv.venda_id = v.id
      WHERE v.id = $1
      GROUP BY v.id
    `, [id])
        if (rows.length === 0) return null
        return new Venda(rows[0])
    }

    async create(cliente_id, vendedor_id) {
        const { rows } = await db.query(
            'INSERT INTO vendas (cliente_id, vendedor_id, status) VALUES ($1, $2, $3) RETURNING *',
            [cliente_id, vendedor_id, 'pendente']
        )
        return rows[0]
    }

    async createItem(venda_id, produto_id, quantidade, preco_unitario) {
        await db.query(
            'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
            [venda_id, produto_id, quantidade, preco_unitario]
        )
    }

    async updateStatus(id, status) {
        const { rows } = await db.query(
            'UPDATE vendas SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        )
        if (rows.length === 0) return null
        return rows[0]
    }

    async findItens(venda_id) {
        const { rows } = await db.query(
            'SELECT * FROM itens_venda WHERE venda_id = $1',
            [venda_id]
        )
        return rows
    }
}

module.exports = new VendaRepository()