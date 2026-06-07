const express = require('express')
const database = require('./database/database')
const { createTables } = require('./database/seed')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'DrinkFlow - Main Service rodando!' })
})

const start = async () => {
    await database.waitForConnection()
    await createTables()
    app.listen(PORT, () => {
        console.log(`Main Service rodando na porta ${PORT}`)
    })
}

start()