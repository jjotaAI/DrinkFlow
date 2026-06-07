const express = require('express')
const router = express.Router()
const produtoController = require('../controllers/produtoController')

router.get('/', produtoController.listarProdutos.bind(produtoController))
router.get('/:id', produtoController.buscarProduto.bind(produtoController))
router.post('/', produtoController.criarProduto.bind(produtoController))
router.put('/:id', produtoController.atualizarProduto.bind(produtoController))
router.delete('/:id', produtoController.deletarProduto.bind(produtoController))

module.exports = router