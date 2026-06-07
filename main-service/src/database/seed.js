const db = require('./database').getConnection()

const createTables = async () => {
    try {
        await db.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

        await db.query(`
      CREATE TABLE IF NOT EXISTS vendedores (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

        await db.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco NUMERIC(10,2) NOT NULL,
        quantidade_estoque INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

        await db.query(`
      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id),
        vendedor_id INTEGER NOT NULL REFERENCES vendedores(id),
        status TEXT NOT NULL DEFAULT 'pendente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

        await db.query(`
      CREATE TABLE IF NOT EXISTS itens_venda (
        id SERIAL PRIMARY KEY,
        venda_id INTEGER NOT NULL REFERENCES vendas(id),
        produto_id INTEGER NOT NULL REFERENCES produtos(id),
        quantidade INTEGER NOT NULL,
        preco_unitario NUMERIC(10,2) NOT NULL
      )
    `)

        console.log('Tabelas criadas com sucesso!')
        await insertInitialData()

    } catch (err) {
        console.error('Erro ao criar tabelas:', err.message)
    }
}

const insertInitialData = async () => {
    try {
        const { rows } = await db.query('SELECT COUNT(*) as count FROM clientes')
        if (parseInt(rows[0].count) > 0) {
            console.log('Dados iniciais já existem, seed ignorado.')
            return
        }

        const clientes = [
            ['Carlos Silva', 'carlos@email.com', '71999990001'],
            ['Ana Souza', 'ana@email.com', '71999990002'],
            ['Pedro Lima', 'pedro@email.com', '71999990003'],
            ['Mariana Costa', 'mariana@email.com', '71999990004'],
            ['Lucas Oliveira', 'lucas@email.com', '71999990005']
        ]
        for (const c of clientes) {
            await db.query('INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3)', c)
        }

        const vendedores = [
            ['João Vendas', 'joao.vendas@drinkflow.com', '71988880001'],
            ['Fernanda Shop', 'fernanda.shop@drinkflow.com', '71988880002']
        ]
        for (const v of vendedores) {
            await db.query('INSERT INTO vendedores (nome, email, telefone) VALUES ($1, $2, $3)', v)
        }

        const produtos = [
            ['Heineken 600ml', 'Cerveja lager premium', 12.90, 100],
            ['Budweiser 350ml', 'Cerveja American lager', 6.90, 150],
            ['Jack Daniels 1L', 'Whiskey Tennessee', 189.90, 30],
            ['Absolut Vodka 750ml', 'Vodka sueca premium', 89.90, 50],
            ['Johnnie Walker Red 1L', 'Scotch whisky blend', 149.90, 40],
            ['Bacardi Carta Blanca 750ml', 'Rum branco cubano', 79.90, 60],
            ['Vinho Miolo Merlot 750ml', 'Vinho tinto seco nacional', 59.90, 80],
            ['Gin Tanqueray 750ml', 'Gin London dry premium', 129.90, 35],
            ['Amstel 600ml', 'Cerveja lager holandesa', 11.90, 120],
            ['Espumante Chandon Brut 750ml', 'Espumante brasileiro premium', 99.90, 45]
        ]
        for (const p of produtos) {
            await db.query('INSERT INTO produtos (nome, descricao, preco, quantidade_estoque) VALUES ($1, $2, $3, $4)', p)
        }

        console.log('Dados iniciais inseridos com sucesso!')

    } catch (err) {
        console.error('Erro ao inserir dados iniciais:', err.message)
    }
}

module.exports = { createTables }