require('dotenv').config()
const express = require('express')
const database = require('./database/database')
const relatorioRoutes = require('./routes/relatorioRoutes')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'DrinkFlow - Report Service rodando!' })
})

app.use('/relatorios', relatorioRoutes)

const start = async () => {
    await database.waitForConnection()
    app.listen(PORT, () => {
        console.log(`Report Service rodando na porta ${PORT}`)
    })
}

start()