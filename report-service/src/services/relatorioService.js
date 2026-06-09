const relatorioRepository = require('../repositories/relatorioRepository')

class RelatorioService {
    async produtosMaisVendidos() {
        const dados = await relatorioRepository.produtosMaisVendidos()
        if (dados.length === 0) {
            throw new Error('Nenhuma venda encontrada para gerar o relatório')
        }
        return {
            titulo: 'Produtos Mais Vendidos',
            gerado_em: new Date().toISOString(),
            dados
        }
    }

    async produtosPorCliente() {
        const dados = await relatorioRepository.produtosPorCliente()
        if (dados.length === 0) {
            throw new Error('Nenhuma venda encontrada para gerar o relatório')
        }

        const clientesMap = {}
        dados.forEach(row => {
            if (!clientesMap[row.cliente_id]) {
                clientesMap[row.cliente_id] = {
                    cliente_id: row.cliente_id,
                    cliente_nome: row.cliente_nome,
                    produtos: []
                }
            }
            clientesMap[row.cliente_id].produtos.push({
                produto_id: row.produto_id,
                produto_nome: row.produto_nome,
                quantidade_comprada: row.quantidade_comprada
            })
        })

        return {
            titulo: 'Produtos por Cliente',
            gerado_em: new Date().toISOString(),
            dados: Object.values(clientesMap)
        }
    }

    async consumoMedioCliente() {
        const dados = await relatorioRepository.consumoMedioCliente()
        if (dados.length === 0) {
            throw new Error('Nenhuma venda encontrada para gerar o relatório')
        }
        return {
            titulo: 'Consumo Médio por Cliente',
            gerado_em: new Date().toISOString(),
            dados
        }
    }

    async produtosBaixoEstoque(limite) {
        const dados = await relatorioRepository.produtosBaixoEstoque(limite)
        return {
            titulo: 'Produtos com Baixo Estoque',
            limite_utilizado: limite || 20,
            gerado_em: new Date().toISOString(),
            dados
        }
    }
}

module.exports = new RelatorioService()