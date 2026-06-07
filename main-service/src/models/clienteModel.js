class Cliente {
    constructor({id, nome, email, telefone, created_at}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.created_at = created_at;
    }
}

module.exports = Cliente;