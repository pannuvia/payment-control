# 💳 Payment Control: API GraphQL & Testes Automatizados

API GraphQL desenvolvida em Node.js/Express para cadastro de usuários, funcionários e processamento de folha de pagamento em memória

**Suíte de testes automatizados de integração e regressão**, desenvolvida por Pannuvia Soares Monteiro para a disciplina de Automação de Testes na Camada de Serviço (API) na Pós-Graduação em Automação de Testes de Software | PGATS-2026-3

---

## ⚡ Execução da API

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar a API
npm start
```

Acesse a interface GraphQL em: `http://localhost:4000/graphql`

---

## 🔐 Fluxo Inicial de Autenticação

1. Faça `login` com `admin@admin.com` e senha `123456`, e copie o token retornado.
2. Envie `Authorization: Bearer <token>` no header para as operações protegidas.

O banco já é iniciado com o usuário `ADMIN` ativo:

```graphql
mutation {
  login(email: "admin@admin.com", senha: "123456") {
    token
    usuario { 
      id 
      nome 
    }
  }
}
```

> ℹ️ Os cadastros são armazenados em memória, nos arrays contidos no arquivo `src/database.js`.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript |
| **Mocha** | Test Runner / Framework de testes |
| **Chai** | Biblioteca de asserções (`expect`) |
| **Supertest** | Cliente HTTP para testes de integração de API |
| **@faker-js/faker** | Gerador de massa de dados dinâmicos e aleatórios |

---

## 🧪 Escopo e Cenários de Teste

### 🔑 Mutation: `login` (`test/specs/mutations/login.test.js`)
* **Sucesso (HTTP 200):** Valida a autenticação de credenciais válidas com emissão de token JWT ativo em formato string não vazio.
* **Erros de Negócio (HTTP 200):** Valida a resposta com a mensagem *"Credenciais inválidas ou usuário inativo."* ao tentar autenticar com e-mail inválido, senha incorreta, e-mail/senha vazios ou combinados.
* **Validações de Schema GraphQL (HTTP 400):** Valida a rejeição da API caso parâmetros obrigatórios sejam omitidos ou passados como `null`.

### 📋 Mutation: `criarFuncionario` (`test/specs/mutations/criarFuncionario.test.js`)
* **Criação com campos obrigatórios:** Valida se um funcionário é criado com sucesso enviando apenas campos obrigatórios (`desligamento: null`).
* **Criação completa:** Valida o cadastro completo com todos os campos preenchidos utilizando massa dinâmica via Faker.

---

## 📁 Estrutura do Projeto

```text
payment-control/
├── src/                      # Código-fonte da API GraphQL
│   └── database.js           # Banco de dados em memória
│
├── test/                     # Suíte de Testes Automatizados
│   ├── config/               # Configurações de ambiente (ex: env.js com API_URL)
│   │   └── env.js
│   │
│   ├── fixtures/             # Data Factories e Queries GraphQL (ex: funcionarioFactory.js)
│   │   └── funcionarioFactory.js
│   │
│   ├── helpers/              # Ações de apoio reutilizáveis (ex: authHelper.js)
│   │   └── authHelper.js
│   │
│   └── specs/                # Suítes de testes executáveis organizadas por tipo
│       └── mutations/
│           ├── login.test.js
│           └── criarFuncionario.test.js
│
├── package.json
└── README.md
```

---

## 🚀 Como Executar os Testes

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- A API GraphQL do `payment-control` deve estar em execução na porta `4000` (ou na URL configurada).

### Passos para Execução

1. **Instalar Dependências**
   ```bash
   npm install
   ```

2. **Executar a Suíte Completa de Testes**
   ```bash
   npx mocha --recursive "test/specs/**/*.test.js"
   ```

3. **Executar Apenas os Testes de Login**
   ```bash
   npx mocha "test/specs/mutations/login.test.js"
   ```

4. **Executar em Outros Ambientes (QA / Staging)**
   O projeto aceita sobrescrita da URL base via variável de ambiente:
   ```bash
   API_URL=[https://qa-api.paymentcontrol.com](https://qa-api.paymentcontrol.com) npx mocha --recursive "test/specs/**/*.test.js"
   ```

---

## 🏛️ Padrões de Arquitetura

| Padrão / Camada | Descrição |
| :--- | :--- |
| **Isolamento de Configuração** (`test/config/`) | Permite alterar a URL base da API centralizadamente via `env.js` ou por linha de comando. |
| **Data Factories** (`test/fixtures/`) | Geram dados dinâmicos via `@faker-js/faker` para mutations como `criarFuncionario`, evitando conflitos de dados duplicados. |
| **Massa Determinística (Login)** | O teste de login faz uso de dados estáticos/conhecidos (`admin@admin.com`) para validar sucesso e falhas controladas. |
| **Authentication Helpers** (`test/helpers/`) | Centralizam o login antes da execução de endpoints protegidos. **Nota:** O `login.test.js` não consome este helper para evitar dependência circular, realizando chamadas diretas à API. |
| **Organização das Specs** (`test/specs/`) | Estruturadas por tipo de operação GraphQL (`mutations` / `queries`). |