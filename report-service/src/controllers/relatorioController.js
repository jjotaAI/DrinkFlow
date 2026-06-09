const relatorioService = require('../services/relatorioService')

class RelatorioController {
    async produtosMaisVendidos(req, res) {
        try {
            const relatorio = await relatorioService.produtosMaisVendidos()
            res.status(200).json(relatorio)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async produtosPorCliente(req, res) {
        try {
            const relatorio = await relatorioService.produtosPorCliente()
            res.status(200).json(relatorio)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async consumoMedioCliente(req, res) {
        try {
            const relatorio = await relatorioService.consumoMedioCliente()
            res.status(200).json(relatorio)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async produtosBaixoEstoque(req, res) {
        try {
            const limite = req.query.limite ? parseInt(req.query.limite) : 20
            const relatorio = await relatorioService.produtosBaixoEstoque(limite)
            res.status(200).json(relatorio)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = new RelatorioController()