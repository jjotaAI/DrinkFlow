require('dotenv').config()
const express = require('express')
const database = require('./database/database')
const { createTables } = require('./database/seed')
const clienteRoutes = require('./routes/clienteRoutes')
const vendedorRoutes = require('./routes/vendedorRoutes')
const produtoRoutes = require('./routes/produtoRoutes')
const vendaRoutes = require('./routes/vendaRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'DrinkFlow - Main Service rodando!' })
})

app.use('/clientes', clienteRoutes)
app.use('/vendedores', vendedorRoutes)
app.use('/produtos', produtoRoutes)
app.use('/vendas', vendaRoutes)

const start = async () => {
    await database.waitForConnection()
    await createTables()
    app.listen(PORT, () => {
        console.log(`Main Service rodando na porta ${PORT}`)
    })
}

start()