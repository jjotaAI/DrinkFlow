const produtoService = require('../services/produtoService')

class ProdutoController {
    async listarProdutos(req, res) {
        try {
            const produtos = await produtoService.listarProdutos()
            res.status(200).json(produtos)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async buscarProduto(req, res) {
        try {
            const produto = await produtoService.buscarProduto(req.params.id)
            res.status(200).json(produto)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async criarProduto(req, res) {
        try {
            const { nome, descricao, preco, quantidade_estoque } = req.body
            const produto = await produtoService.criarProduto(nome, descricao, preco, quantidade_estoque)
            res.status(201).json(produto)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async atualizarProduto(req, res) {
        try {
            const { nome, descricao, preco, quantidade_estoque } = req.body
            const produto = await produtoService.atualizarProduto(req.params.id, nome, descricao, preco, quantidade_estoque)
            res.status(200).json(produto)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async deletarProduto(req, res) {
        try {
            const resultado = await produtoService.deletarProduto(req.params.id)
            res.status(200).json(resultado)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }
}

module.exports = new ProdutoController()