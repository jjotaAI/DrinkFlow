const vendaRepository = require('../repositories/vendaRepository')
const clienteRepository = require('../repositories/clienteRepository')
const vendedorRepository = require('../repositories/vendedorRepository')
const produtoRepository = require('../repositories/produtoRepository')

class VendaService {
    async listarVendas() {
        return await vendaRepository.findAll()
    }

    async buscarVenda(id) {
        const venda = await vendaRepository.findById(id)
        if (!venda) {
            throw new Error('Venda não encontrada')
        }
        return venda
    }

    async criarVenda(cliente_id, vendedor_id, itens) {
        if (!cliente_id || !vendedor_id || !itens || itens.length === 0) {
            throw new Error('Cliente, vendedor e itens são obrigatórios')
        }

        const cliente = await clienteRepository.findById(cliente_id)
        if (!cliente) throw new Error('Cliente não encontrado')

        const vendedor = await vendedorRepository.findById(vendedor_id)
        if (!vendedor) throw new Error('Vendedor não encontrado')

        for (const item of itens) {
            const produto = await produtoRepository.findById(item.produto_id)
            if (!produto) throw new Error(`Produto ${item.produto_id} não encontrado`)
            if (produto.quantidade_estoque < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto ${produto.nome}`)
            }
        }

        const venda = await vendaRepository.create(cliente_id, vendedor_id)

        for (const item of itens) {
            const produto = await produtoRepository.findById(item.produto_id)
            await vendaRepository.createItem(venda.id, item.produto_id, item.quantidade, produto.preco)
            await produtoRepository.updateEstoque(item.produto_id, -item.quantidade)
        }

        return await vendaRepository.findById(venda.id)
    }

    async cancelarVenda(id) {
        const venda = await vendaRepository.findById(id)
        if (!venda) throw new Error('Venda não encontrada')
        if (venda.status === 'cancelada') {
            throw new Error('Venda já está cancelada')
        }
        if (venda.status === 'concluida') {
            throw new Error('Venda concluída não pode ser cancelada')
        }

        const itens = await vendaRepository.findItens(id)
        for (const item of itens) {
            await produtoRepository.updateEstoque(item.produto_id, item.quantidade)
        }

        await vendaRepository.updateStatus(id, 'cancelada')
        return { message: 'Venda cancelada com sucesso' }
    }

    async concluirVenda(id) {
        const venda = await vendaRepository.findById(id)
        if (!venda) throw new Error('Venda não encontrada')
        if (venda.status === 'cancelada') {
            throw new Error('Venda cancelada não pode ser concluída')
        }
        if (venda.status === 'concluida') {
            throw new Error('Venda já está concluída')
        }

        await vendaRepository.updateStatus(id, 'concluida')
        return { message: 'Venda concluída com sucesso' }
    }
}

module.exports = new VendaService()