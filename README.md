# DrinkFlow 🍺

Sistema de gestão de vendas de uma rede de lojas de bebidas alcoólicas, desenvolvido como projeto A3 da UC Sistemas Distribuídos e Mobile.

## Sobre o Projeto

O DrinkFlow é composto por dois serviços independentes:

- **main-service** (porta 3000) → responsável por gerenciar clientes, vendedores, produtos/estoque e vendas
- **report-service** (porta 3001) → responsável por gerar relatórios estatísticos

Ambos os serviços compartilham o mesmo banco de dados PostgreSQL e são orquestrados pelo Docker Compose.

---

## Requisitos de Software

Antes de rodar a aplicação, certifique-se de ter instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — versão 20 ou superior
- [Git](https://git-scm.com/) — para clonar o repositório
- [Postman](https://www.postman.com/) ou similar — para testar os endpoints (opcional)

> Não é necessário instalar Node.js ou PostgreSQL na máquina. Tudo roda dentro dos containers Docker.

---

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/jjotaAI/DrinkFlow.git
cd DrinkFlow
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e defina os valores:
DB_HOST=postgres
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=drinkflow
MAIN_PORT=3000
REPORT_PORT=3001

> **Importante:** Os valores de `DB_USER` e `DB_PASSWORD`são livres, mas devem ser os mesmos no `.env`. O `DB_HOST` deve permanecer como `postgres`.

### 3. Subir a aplicação

```bash
docker compose up --build
```

Aguarde até ver as seguintes mensagens no terminal:
drinkflow-main | Tabelas criadas com sucesso!
drinkflow-main | Dados iniciais inseridos com sucesso!
drinkflow-main | Main Service rodando na porta 3000
drinkflow-report | Report Service rodando na porta 3001

> Na primeira execução o Docker irá baixar as imagens necessárias. Isso pode levar alguns minutos dependendo da conexão.

### 4. Verificar se está funcionando

Acesse no navegador ou Postman:
GET http://localhost:3000/
GET http://localhost:3001/

Ambos devem retornar uma mensagem de confirmação.

### 5. Encerrar a aplicação

```bash
docker compose down
```

> **Atenção:** Não utilize `docker compose down -v` pois isso apagará todos os dados do banco.

---

## Dados Iniciais

O sistema já inicia com dados pré-cadastrados:

- **10 produtos** — cervejas, destilados, vinhos e espumantes
- **5 clientes** — Carlos, Ana, Pedro, Mariana e Lucas
- **2 vendedores** — João Vendas e Fernanda Shop

---

## Endpoints

### Main Service — `http://localhost:3000`

#### Clientes

| Método | Rota          | Descrição               |
| ------ | ------------- | ----------------------- |
| GET    | /clientes     | Lista todos os clientes |
| GET    | /clientes/:id | Busca cliente por ID    |
| POST   | /clientes     | Cria novo cliente       |
| PUT    | /clientes/:id | Atualiza cliente        |
| DELETE | /clientes/:id | Remove cliente          |

**Exemplo POST /clientes:**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "71999990001"
}
```

---

#### Vendedores

| Método | Rota            | Descrição                 |
| ------ | --------------- | ------------------------- |
| GET    | /vendedores     | Lista todos os vendedores |
| GET    | /vendedores/:id | Busca vendedor por ID     |
| POST   | /vendedores     | Cria novo vendedor        |
| PUT    | /vendedores/:id | Atualiza vendedor         |
| DELETE | /vendedores/:id | Remove vendedor           |

**Exemplo POST /vendedores:**

```json
{
  "nome": "Maria Vendas",
  "email": "maria@drinkflow.com",
  "telefone": "71988880001"
}
```

---

#### Produtos

| Método | Rota          | Descrição               |
| ------ | ------------- | ----------------------- |
| GET    | /produtos     | Lista todos os produtos |
| GET    | /produtos/:id | Busca produto por ID    |
| POST   | /produtos     | Cria novo produto       |
| PUT    | /produtos/:id | Atualiza produto        |
| DELETE | /produtos/:id | Remove produto          |

**Exemplo POST /produtos:**

```json
{
  "nome": "Corona 350ml",
  "descricao": "Cerveja mexicana premium",
  "preco": 8.9,
  "quantidade_estoque": 80
}
```

---

#### Vendas

| Método | Rota                 | Descrição             |
| ------ | -------------------- | --------------------- |
| GET    | /vendas              | Lista todas as vendas |
| GET    | /vendas/:id          | Busca venda por ID    |
| POST   | /vendas              | Cria nova venda       |
| PATCH  | /vendas/:id/concluir | Conclui uma venda     |
| DELETE | /vendas/:id          | Cancela uma venda     |

**Exemplo POST /vendas:**

```json
{
  "cliente_id": 1,
  "vendedor_id": 1,
  "itens": [
    { "produto_id": 1, "quantidade": 2 },
    { "produto_id": 3, "quantidade": 1 }
  ]
}
```

> **Ciclo de vida de uma venda:**
>
> - Toda venda nasce com status `pendente`
> - Pode ser `concluída` via PATCH /vendas/:id/concluir
> - Pode ser `cancelada` via DELETE /vendas/:id
> - Uma venda concluída não pode ser cancelada
> - Ao cancelar uma venda o estoque é devolvido automaticamente

---

### Report Service — `http://localhost:3001`

#### Relatórios

| Método | Rota                      | Descrição                      |
| ------ | ------------------------- | ------------------------------ |
| GET    | /relatorios/mais-vendidos | Produtos mais vendidos         |
| GET    | /relatorios/por-cliente   | Produtos comprados por cliente |
| GET    | /relatorios/consumo-medio | Consumo médio por cliente      |
| GET    | /relatorios/baixo-estoque | Produtos com baixo estoque     |

> O relatório de baixo estoque aceita um parâmetro opcional de limite:
>
> ```
> GET http://localhost:3001/relatorios/baixo-estoque?limite=10
> ```
>
> Se não informado, o limite padrão é 20 unidades.

---

## Arquitetura

O projeto segue o padrão **MVC** (Model-View-Controller) adaptado para APIs REST, com camadas adicionais para melhor organização:

Requisição HTTP
↓
Routes → mapeia URLs para controllers
↓
Controllers → recebe requisição e devolve resposta
↓
Services → contém as regras de negócio
↓
Repositories → acessa o banco de dados
↓
Models → define a estrutura dos dados
↓
PostgreSQL → banco de dados relacional

---

## Padrões de Projeto

| Padrão            | Onde é aplicado                                                                       |
| ----------------- | ------------------------------------------------------------------------------------- |
| **Singleton**     | Conexão com o banco de dados (`database.js`) — garante uma única instância de conexão |
| **Repository**    | Camada de acesso ao banco isolada (`repositories/`) — separa queries SQL do restante  |
| **Service Layer** | Camada de regras de negócio (`services/`) — separa lógica do controller               |
| **Factory**       | Models (`models/`) — transforma dados brutos do banco em objetos padronizados         |

---

## Estrutura Docker

docker-compose.yml
├── drinkflow-db → PostgreSQL 15 (porta 5432)
├── drinkflow-main → Main Service Node.js (porta 3000)
└── drinkflow-report → Report Service Node.js (porta 3001)
