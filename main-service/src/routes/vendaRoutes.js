const express = require('express')
const router = express.Router()
const vendaController = require('../controllers/vendaController')

router.get('/', vendaController.listarVendas.bind(vendaController))
router.get('/:id', vendaController.buscarVenda.bind(vendaController))
router.post('/', vendaController.criarVenda.bind(vendaController))
router.patch('/:id/concluir', vendaController.concluirVenda.bind(vendaController))
router.delete('/:id', vendaController.cancelarVenda.bind(vendaController))

module.exports = router