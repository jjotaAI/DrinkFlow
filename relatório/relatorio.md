# Relatório do Projeto — DrinkFlow

Trabalho A3 — UC Sistemas Distribuídos e Mobile
UNIFACS — Universidade Salvador

---

## a. Equipe

| Nome                    | RA          |
| ----------------------- | ----------- |
| João Pedro Santos       | 12724226404 |
| Vinicius de Liro Macedo | 12724219058 |
| Gabriel Ribeiro Bento   | 1272326164  |

---

## b. Requisitos de Software

### Requisitos para execução

Para executar a aplicação é necessário apenas o Docker Desktop instalado na máquina. Todos os demais componentes rodam dentro dos containers.

| Software       | Versão mínima           | Finalidade                  |
| -------------- | ----------------------- | --------------------------- |
| Docker Desktop | 20.0 ou superior        | Orquestração dos containers |
| Git            | Qualquer versão recente | Clonar o repositório        |

### Tecnologias utilizadas internamente

Estas tecnologias não precisam ser instaladas na máquina — rodam dentro dos containers Docker.

| Tecnologia | Versão      | Finalidade                                    |
| ---------- | ----------- | --------------------------------------------- |
| Node.js    | 20 (Alpine) | Runtime JavaScript dos serviços               |
| Express    | 5.2.1       | Framework HTTP para as APIs REST              |
| PostgreSQL | 15          | Banco de dados relacional                     |
| pg         | 8.21.0      | Driver de conexão Node.js com PostgreSQL      |
| dotenv     | 17.4.2      | Gerenciamento de variáveis de ambiente        |
| nodemon    | 3.1.14      | Reinicialização automática em desenvolvimento |

### Estrutura de serviços

A aplicação é composta por três containers:

- **drinkflow-db** — container do banco de dados PostgreSQL
- **drinkflow-main** — container do serviço principal (main-service)
- **drinkflow-report** — container do serviço de relatórios (report-service)

---

## c. Instruções para Instalação e Execução

### Pré-requisitos

Certifique-se de que o Docker Desktop está instalado e em execução na máquina antes de prosseguir.

### Passo 1 — Clonar o repositório

```bash
git clone https://github.com/jjotaAI/DrinkFlow.git
cd DrinkFlow
```

### Passo 2 — Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e defina as credenciais:
DB_HOST=postgres
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=drinkflow
MAIN_PORT=3000
REPORT_PORT=3001

> **Importante:** Os valores de `DB_USER` e `DB_PASSWORD` são livres. O valor de `DB_HOST` deve permanecer como `postgres` pois é o nome do container do banco de dados dentro da rede Docker.

### Passo 3 — Subir a aplicação

```bash
docker compose up --build
```

Aguarde até que as seguintes mensagens apareçam no terminal:
drinkflow-main | Tabelas criadas com sucesso!
drinkflow-main | Dados iniciais inseridos com sucesso!
drinkflow-main | Main Service rodando na porta 3000
drinkflow-report | Report Service rodando na porta 3001

> Na primeira execução o Docker irá baixar as imagens necessárias. Isso pode levar alguns minutos dependendo da conexão com a internet.

### Passo 4 — Verificar o funcionamento

Acesse no navegador ou em uma ferramenta como o Postman:
GET http://localhost:3000/
GET http://localhost:3001/

Ambos devem retornar uma mensagem JSON confirmando que os serviços estão no ar.

### Passo 5 — Encerrar a aplicação

```bash
docker compose down
```

> **Atencao:** Nao utilize `docker compose down -v` pois isso removerá o volume do banco de dados, apagando todos os dados persistidos.

### Dados iniciais

O sistema já inicia com os seguintes dados pré-cadastrados via seed automático:

- 10 produtos cadastrados — cervejas, destilados, vinhos e espumantes
- 5 clientes cadastrados — Carlos, Ana, Pedro, Mariana e Lucas
- 2 vendedores cadastrados — João Vendas e Fernanda Shop

---

## d. Arquitetura, Estratégia e Algoritmos

### Visão Geral da Arquitetura

O DrinkFlow é uma aplicação distribuída composta por dois serviços independentes que compartilham o mesmo banco de dados PostgreSQL, orquestrados pelo Docker Compose.
Cliente (Postman / Navegador)
|
------+------
| |
| porta 3000| porta 3001
| |
main-service report-service
| |
+-----+-----+
|
PostgreSQL
(porta 5432)

### Padrão de Arquitetura — MVC

O projeto adota o padrão MVC (Model-View-Controller) adaptado para APIs REST. Como a aplicação não possui interface visual, a camada View é substituída pelas respostas JSON devolvidas pelos Controllers.

O fluxo de uma requisição percorre as seguintes camadas:
Requisição HTTP
|
Routes — mapeia URLs para controllers
|
Controllers — recebe a requisição e devolve a resposta HTTP
|
Services — contém as regras de negócio
|
Repositories — executa as queries no banco de dados
|
Models — define e padroniza a estrutura dos dados
|
PostgreSQL — banco de dados relacional

Cada camada tem uma responsabilidade única e bem definida, o que facilita a manutenção, os testes e a evolução do sistema.

### Padrões de Projeto

#### 1. Singleton

Aplicado na camada de conexão com o banco de dados (`database.js`) em ambos os serviços.

O padrão Singleton garante que apenas uma instância da conexão com o banco seja criada durante todo o ciclo de vida da aplicação. Isso evita a abertura desnecessária de múltiplas conexões, economizando recursos do servidor.

```javascript
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance  // retorna a instância existente
    }
    this.pool = new Pool({ ... })
    Database.instance = this   // armazena a única instância
  }
}
```

#### 2. Repository Pattern

Aplicado na camada `repositories/` de ambos os serviços.

O padrão Repository isola toda a lógica de acesso ao banco de dados em uma camada dedicada. Os Services nunca executam queries SQL diretamente — eles delegam essa responsabilidade aos Repositories. Isso desacopla a lógica de negócio da tecnologia de persistência, facilitando futuras trocas de banco de dados.

```javascript
class ClienteRepository {
  async findById(id) {
    const { rows } = await db.query("SELECT * FROM clientes WHERE id = $1", [
      id,
    ]);
    return rows.length === 0 ? null : new Cliente(rows[0]);
  }
}
```

#### 3. Service Layer

Aplicado na camada `services/` de ambos os serviços.

O padrão Service Layer centraliza as regras de negócio da aplicação. Os Controllers não tomam decisões de negócio — eles apenas recebem a requisição, delegam para o Service e devolvem a resposta. Exemplos de regras de negócio implementadas nos Services:

- Uma venda só pode ser criada se houver estoque suficiente para todos os itens
- Uma venda concluída não pode ser cancelada
- O estoque é devolvido automaticamente ao cancelar uma venda
- Campos obrigatórios são validados antes de persistir no banco

#### 4. Factory Pattern

Aplicado na camada `models/` do main-service.

O padrão Factory é utilizado nos Models para transformar os dados brutos retornados pelo banco de dados em objetos padronizados da aplicação. Isso garante que independentemente de como o dado vem do banco, ele sempre será entregue no mesmo formato para as camadas superiores.

```javascript
class Cliente {
  constructor({ id, nome, email, telefone, created_at }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.created_at = created_at;
  }
}

// O Repository usa o Factory para padronizar o retorno
return new Cliente(rows[0]);
```

### Estratégia de Separação de Serviços

A aplicação foi dividida em dois serviços distintos seguindo o princípio de separação de responsabilidades:

**main-service** — responsável por todas as operações de escrita e leitura do sistema:

- Gerenciamento de clientes, vendedores e produtos
- Controle de estoque com atualização automática em cada venda
- Ciclo de vida das vendas (pendente, concluída, cancelada)

**report-service** — responsável exclusivamente pela leitura analítica dos dados:

- Acessa o mesmo banco de dados em modo somente leitura
- Gera relatórios estatísticos através de queries analíticas com agregações SQL
- Não realiza nenhuma operação de escrita no banco

### Algoritmos e Estratégias Relevantes

#### Controle de estoque em vendas

Ao criar uma venda, o sistema percorre todos os itens em dois passos distintos. No primeiro passo valida se todos os produtos existem e possuem estoque suficiente. Somente após todas as validações passarem é que o segundo passo é executado — a criação dos registros e a subtração do estoque. Isso garante que nunca haverá uma venda parcialmente criada no banco.

#### Retry de conexão com o banco

Como o Docker sobe os containers em paralelo, o serviço Node.js pode iniciar antes do PostgreSQL estar pronto para aceitar conexões. Para resolver isso foi implementada uma lógica de retry que tenta conectar ao banco até 10 vezes com intervalo de 3 segundos entre cada tentativa, antes de lançar um erro.

#### Seed automático

Ao iniciar, o main-service verifica se já existem dados na tabela de clientes. Se não existirem, executa o seed com os dados iniciais obrigatórios. Isso garante que o seed nunca será executado duas vezes, evitando duplicação de dados em reinicializações.

#### Agrupamento de dados nos relatórios

O relatório de produtos por cliente retorna dados de múltiplas tabelas em formato normalizado. O Service aplica um algoritmo de agrupamento usando um mapa de objetos para transformar as linhas retornadas pelo banco em uma estrutura hierárquica onde cada cliente contém um array com seus produtos comprados.

### Modelo de Dados

clientes
id, nome, email, telefone, created_at
vendedores
id, nome, email, telefone, created_at
produtos
id, nome, descricao, preco, quantidade_estoque, created_at
vendas
id, cliente_id (FK), vendedor_id (FK), status, created_at
itens_venda
id, venda_id (FK), produto_id (FK), quantidade, preco_unitario

O relacionamento entre vendas e itens_venda segue o modelo um-para-muitos — uma venda pode conter múltiplos itens, e cada item referencia a venda à qual pertence através da chave estrangeira `venda_id`. O preço unitário é armazenado no momento da venda para preservar o histórico mesmo que o preço do produto seja alterado posteriormente.
