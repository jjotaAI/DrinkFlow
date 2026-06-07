const clienteService = require('../services/clienteService')

class ClienteController {
    async listarClientes(req, res) {
        try {
            const clientes = await clienteService.listarClientes()
            res.status(200).json(clientes)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async buscarCliente(req, res) {
        try {
            const cliente = await clienteService.buscarCliente(req.params.id)
            res.status(200).json(cliente)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async criarCliente(req, res) {
        try {
            const { nome, email, telefone } = req.body
            const cliente = await clienteService.criarCliente(nome, email, telefone)
            res.status(201).json(cliente)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async atualizarCliente(req, res) {
        try {
            const { nome, email, telefone } = req.body
            const cliente = await clienteService.atualizarCliente(req.params.id, nome, email, telefone)
            res.status(200).json(cliente)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async deletarCliente(req, res) {
        try {
            const resultado = await clienteService.deletarCliente(req.params.id)
            res.status(200).json(resultado)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }
}

module.exports = new ClienteController()