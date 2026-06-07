const produtoRepository = require('../repositories/produtoRepository')

class ProdutoService {
    async listarProdutos() {
        return await produtoRepository.findAll()
    }

    async buscarProduto(id) {
        const produto = await produtoRepository.findById(id)
        if (!produto) {
            throw new Error('Produto não encontrado')
        }
        return produto
    }

    async criarProduto(nome, descricao, preco, quantidade_estoque) {
        if (!nome || !preco) {
            throw new Error('Nome e preço são obrigatórios')
        }
        if (preco <= 0) {
            throw new Error('Preço deve ser maior que zero')
        }
        if (quantidade_estoque < 0) {
            throw new Error('Quantidade em estoque não pode ser negativa')
        }
        return await produtoRepository.create(nome, descricao, preco, quantidade_estoque)
    }

    async atualizarProduto(id, nome, descricao, preco, quantidade_estoque) {
        if (!nome || !preco) {
            throw new Error('Nome e preço são obrigatórios')
        }
        if (preco <= 0) {
            throw new Error('Preço deve ser maior que zero')
        }
        if (quantidade_estoque < 0) {
            throw new Error('Quantidade em estoque não pode ser negativa')
        }
        const produto = await produtoRepository.update(id, nome, descricao, preco, quantidade_estoque)
        if (!produto) {
            throw new Error('Produto não encontrado')
        }
        return produto
    }

    async deletarProduto(id) {
        const deletado = await produtoRepository.delete(id)
        if (!deletado) {
            throw new Error('Produto não encontrado')
        }
        return { message: 'Produto deletado com sucesso' }
    }
}

module.exports = new ProdutoService()