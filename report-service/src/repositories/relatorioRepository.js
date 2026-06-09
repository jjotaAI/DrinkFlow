const db = require('../database/database').getConnection()

class RelatorioRepository {
    async produtosMaisVendidos() {
        const { rows } = await db.query(`
      SELECT 
        p.id,
        p.nome,
        p.preco,
        SUM(iv.quantidade) as total_vendido
      FROM produtos p
      INNER JOIN itens_venda iv ON iv.produto_id = p.id
      INNER JOIN vendas v ON v.id = iv.venda_id
      WHERE v.status != 'cancelada'
      GROUP BY p.id, p.nome, p.preco
      ORDER BY total_vendido DESC
    `)
        return rows
    }

    async produtosPorCliente() {
        const { rows } = await db.query(`
      SELECT 
        c.id as cliente_id,
        c.nome as cliente_nome,
        p.id as produto_id,
        p.nome as produto_nome,
        SUM(iv.quantidade) as quantidade_comprada
      FROM clientes c
      INNER JOIN vendas v ON v.cliente_id = c.id
      INNER JOIN itens_venda iv ON iv.venda_id = v.id
      INNER JOIN produtos p ON p.id = iv.produto_id
      WHERE v.status != 'cancelada'
      GROUP BY c.id, c.nome, p.id, p.nome
      ORDER BY c.nome, quantidade_comprada DESC
    `)
        return rows
    }

    async consumoMedioCliente() {
        const { rows } = await db.query(`
      SELECT 
        c.id as cliente_id,
        c.nome as cliente_nome,
        COUNT(DISTINCT v.id) as total_vendas,
        SUM(iv.quantidade * iv.preco_unitario) as total_gasto,
        ROUND(SUM(iv.quantidade * iv.preco_unitario) / COUNT(DISTINCT v.id), 2) as consumo_medio
      FROM clientes c
      INNER JOIN vendas v ON v.cliente_id = c.id
      INNER JOIN itens_venda iv ON iv.venda_id = v.id
      WHERE v.status != 'cancelada'
      GROUP BY c.id, c.nome
      ORDER BY consumo_medio DESC
    `)
        return rows
    }

    async produtosBaixoEstoque(limite = 20) {
        const { rows } = await db.query(`
      SELECT 
        id,
        nome,
        descricao,
        preco,
        quantidade_estoque
      FROM produtos
      WHERE quantidade_estoque <= $1
      ORDER BY quantidade_estoque ASC
    `, [limite])
        return rows
    }
}

module.exports = new RelatorioRepository()