const vendaService = require('../services/vendaService')

class VendaController {
    async listarVendas(req, res) {
        try {
            const vendas = await vendaService.listarVendas()
            res.status(200).json(vendas)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async buscarVenda(req, res) {
        try {
            const venda = await vendaService.buscarVenda(req.params.id)
            res.status(200).json(venda)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async criarVenda(req, res) {
        try {
            const { cliente_id, vendedor_id, itens } = req.body
            const venda = await vendaService.criarVenda(cliente_id, vendedor_id, itens)
            res.status(201).json(venda)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async cancelarVenda(req, res) {
        try {
            const resultado = await vendaService.cancelarVenda(req.params.id)
            res.status(200).json(resultado)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async concluirVenda(req, res) {
        try {
            const resultado = await vendaService.concluirVenda(req.params.id)
            res.status(200).json(resultado)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }
}

module.exports = new VendaController()