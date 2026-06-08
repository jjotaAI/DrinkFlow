class Venda {
    constructor({ id, cliente_id, vendedor_id, status, created_at, itens }) {
        this.id = id
        this.cliente_id = cliente_id
        this.vendedor_id = vendedor_id
        this.status = status
        this.created_at = created_at
        this.itens = itens || []
    }
}

module.exports = Venda