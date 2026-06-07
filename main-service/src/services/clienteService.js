const clienteRepository = require('../repositories/clienteRepository')

class ClienteService {
    async listarClientes() {
        return await clienteRepository.findAll()
    }

    async buscarCliente(id) {
        const cliente = await clienteRepository.findById(id)
        if (!cliente) {
            throw new Error('Cliente não encontrado')
        }
        return cliente
    }

    async criarCliente(nome, email, telefone) {
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios')
        }
        return await clienteRepository.create(nome, email, telefone)
    }

    async atualizarCliente(id, nome, email, telefone) {
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios')
        }
        const cliente = await clienteRepository.update(id, nome, email, telefone)
        if (!cliente) {
            throw new Error('Cliente não encontrado')
        }
        return cliente
    }

    async deletarCliente(id) {
        const deletado = await clienteRepository.delete(id)
        if (!deletado) {
            throw new Error('Cliente não encontrado')
        }
        return { message: 'Cliente deletado com sucesso' }
    }
}

module.exports = new ClienteService()