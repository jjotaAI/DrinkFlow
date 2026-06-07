const vendedorService = require('../services/vendedorService')

class VendedorController {
    async listarVendedores(req, res) {
        try {
            const vendedores = await vendedorService.listarVendedores()
            res.status(200).json(vendedores)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async buscarVendedor(req, res) {
        try {
            const vendedor = await vendedorService.buscarVendedor(req.params.id)
            res.status(200).json(vendedor)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async criarVendedor(req, res) {
        try {
            const { nome, email, telefone } = req.body
            const vendedor = await vendedorService.criarVendedor(nome, email, telefone)
            res.status(201).json(vendedor)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async atualizarVendedor(req, res) {
        try {
            const { nome, email, telefone } = req.body
            const vendedor = await vendedorService.atualizarVendedor(req.params.id, nome, email, telefone)
            res.status(200).json(vendedor)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async deletarVendedor(req, res) {
        try {
            const resultado = await vendedorService.deletarVendedor(req.params.id)
            res.status(200).json(resultado)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }
}

module.exports = new VendedorController()