const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')

router.get('/', clienteController.listarClientes.bind(clienteController))
router.get('/:id', clienteController.buscarCliente.bind(clienteController))
router.post('/', clienteController.criarCliente.bind(clienteController))
router.put('/:id', clienteController.atualizarCliente.bind(clienteController))
router.delete('/:id', clienteController.deletarCliente.bind(clienteController))

module.exports = router