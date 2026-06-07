const vendedorRepository = require('../repositories/vendedorRepository')

class VendedorService {
    async listarVendedores() {
        return await vendedorRepository.findAll()
    }

    async buscarVendedor(id) {
        const vendedor = await vendedorRepository.findById(id)
        if (!vendedor) {
            throw new Error('Vendedor não encontrado')
        }
        return vendedor
    }

    async criarVendedor(nome, email, telefone) {
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios')
        }
        return await vendedorRepository.create(nome, email, telefone)
    }

    async atualizarVendedor(id, nome, email, telefone) {
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios')
        }
        const vendedor = await vendedorRepository.update(id, nome, email, telefone)
        if (!vendedor) {
            throw new Error('Vendedor não encontrado')
        }
        return vendedor
    }

    async deletarVendedor(id) {
        const deletado = await vendedorRepository.delete(id)
        if (!deletado) {
            throw new Error('Vendedor não encontrado')
        }
        return { message: 'Vendedor deletado com sucesso' }
    }
}

module.exports = new VendedorService()