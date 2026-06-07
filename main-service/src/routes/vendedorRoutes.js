const express = require('express')
const router = express.Router()
const vendedorController = require('../controllers/vendedorController')

router.get('/', vendedorController.listarVendedores.bind(vendedorController))
router.get('/:id', vendedorController.buscarVendedor.bind(vendedorController))
router.post('/', vendedorController.criarVendedor.bind(vendedorController))
router.put('/:id', vendedorController.atualizarVendedor.bind(vendedorController))
router.delete('/:id', vendedorController.deletarVendedor.bind(vendedorController))

module.exports = router