const express = require('express')
const router = express.Router()
const relatorioController = require('../controllers/relatorioController')

router.get('/mais-vendidos', relatorioController.produtosMaisVendidos.bind(relatorioController))
router.get('/por-cliente', relatorioController.produtosPorCliente.bind(relatorioController))
router.get('/consumo-medio', relatorioController.consumoMedioCliente.bind(relatorioController))
router.get('/baixo-estoque', relatorioController.produtosBaixoEstoque.bind(relatorioController))

module.exports = router