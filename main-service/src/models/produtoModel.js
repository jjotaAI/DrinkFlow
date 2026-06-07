class Produto {
    constructor({ id, nome, descricao, preco, quantidade_estoque, created_at }) {
        this.id = id
        this.nome = nome
        this.descricao = descricao
        this.preco = preco
        this.quantidade_estoque = quantidade_estoque
        this.created_at = created_at
    }
}

module.exports = Produto