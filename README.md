# 💳 Payment Control: API GraphQL & Testes Automatizados

API GraphQL desenvolvida em Node.js/Express para cadastro de usuários, funcionários e processamento de folha de pagamento em memória.

**Suíte de testes automatizados de integração e regressão**, desenvolvida por Pannuvia Soares Monteiro para a disciplina de Automação de Testes na Camada de Serviço (API) na Pós-Graduação em Automação de Testes de Software | **PGATS-2026-3**.

---

## ⚡ Execução da API

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar a API em modo de desenvolvimento
npm start
```

Acesse a interface GraphQL (Playground/Sandbox) em: `http://localhost:4000/graphql`

---

## 🔐 Fluxo Inicial de Autenticação

1. Execute a mutation de `login` com as credenciais padrão de administrador:
   - **E-mail:** `admin@admin.com`
   - **Senha:** `123456`
2. Copie o token JWT retornado.
3. Envie o cabeçalho `Authorization: Bearer <token>` em todas as operações protegidas.

Exemplo de requisição no Playground:

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

> ℹ️ **Persistência em Memória:** Os cadastros são armazenados temporariamente nos arrays do arquivo `src/database.js` e reiniciados a cada execução da API.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
| :--- | :--- |
| **Node.js & Express** | Ambiente de execução e servidor da API |
| **GraphQL** | Linguagem de consulta e schema de dados da API |
| **Mocha** | Framework executor de testes (Runner) com suporte a `context()` |
| **Chai** | Biblioteca de asserções BDD (`expect`) |
| **Supertest** | Cliente HTTP para testes de integração do endpoint `/graphql` |
| **@faker-js/faker** | Geração dinâmica de massas de dados aleatórias |
| **Mochawesome** | Geração de relatórios de testes automatizados em formato HTML/JSON |
| **ESLint 9** | Análise estática, linting e padronização de código via Flat Config (`eslint.config.mjs`) |

---

## 🧪 Escopo e Cenários de Teste

A suíte de testes cobre validações em nível de **Contrato (GraphQL Schema)**, **Segurança (JWT)** e **Regras de Negócio**.

### 🔑 Mutation: `login` (`test/specs/mutations/login.test.js`)
* **Cenários de Sucesso (HTTP 200):** Valida a autenticação de credenciais válidas com geração de token JWT ativo em formato string não vazio.
* **Segurança e Regras de Negócio (HTTP 200):** Valida retorno da mensagem de erro ao tentar autenticar com e-mail inexistente, senha incorreta, e-mail/senha vazios ou inativos.
* **Validações de Schema GraphQL (HTTP 400):** Rejeição da requisição ao omitir parâmetros obrigatórios ou enviá-los como `null`.

### 📋 Mutation: `criarFuncionario` (`test/specs/mutations/criarFuncionario.test.js`)
* **Cenários de Sucesso:**
  * Criação de funcionário apenas com campos obrigatórios (`cpf`, `nome`, `salario_base`, `admissao`).
  * Criação completa de funcionário incluindo campos opcionais (`desligamento`).
* **Segurança e Autenticação:**
  * Rejeição de criação sem token de autorização no header (`HTTP 200` com erro no array `errors`).
  * Rejeição de criação utilizando token JWT inválido ou adulterado.
* **Regras de Negócio:**
  * Impedimento de cadastro duplicado para o mesmo `CPF`.
  * Impedimento de cadastro com salário zero ou negativo.
  * Impedimento de cadastro com data de desligamento anterior à data de admissão.
  * Impedimento de cadastro com data de admissão em futuro distante.
  * Impedimento de cadastro com nome composto apenas por espaços em branco.
* **Validações de Schema GraphQL (HTTP 400):**
  * Omissão do campo obrigatório `cpf`.
  * Omissão do campo obrigatório `nome`.
  * Envio do campo obrigatório `nome` com valor `null`.
  * Envio de tipo de dado incompatível para o campo `salario_base` (String em vez de Float/Int).
  * Envio de data de admissão em formato inválido.

---

## 📁 Estrutura do Projeto

```text
payment-control/
├── src/                  # Código-fonte da API GraphQL
│   ├── graphql/          # TypeDefs e Resolvers GraphQL
│   ├── repositories/     # Manipulação de dados
│   ├── services/         # Regras de negócio e autenticação JWT
│   ├── database.js       # Banco de dados em memória
│   └── server.js         # Ponto de entrada do servidor e contexto da aplicação
│
├── test/                 # Suíte de Testes Automatizados
│   ├── config/           # Configurações de ambiente
│   │   └── env.js        # Centralização da URL base (API_URL)
│   │
│   ├── fixtures/         # Data Factories e Queries/Mutations GraphQL
│   │   └── funcionarioFactory.js
│   │
│   ├── helpers/          # Funções de apoio e autenticação reutilizáveis
│   │   └── authHelper.js # Helper para geração de token JWT
│   │
│   └── specs/            # Testes automatizados organizados por tipo
│       └── mutations/
│           ├── login.test.js
│           └── criarFuncionario.test.js
│
├── mochawesome-report/   # Relatórios HTML/JSON gerados pela execução dos testes
├── eslint.config.mjs     # Configuração de padronização estática (ESLint Flat Config)
├── package.json
└── README.md
```

---

## 🚀 Como Executar os Testes, Relatórios e Qualidade de Código

### Pré-requisitos
- **Node.js** (v18 ou superior)
- A API GraphQL deve estar em execução (`npm start`) na porta `4000` (ou na URL configurada).

### Comandos de Execução dos Testes

```bash
# Executar a suíte completa de testes
npx mocha --recursive "test/specs/**/*.test.js"

# Executar apenas os testes de criarFuncionario
npx mocha "test/specs/mutations/criarFuncionario.test.js"

# Executar apenas os testes de login
npx mocha "test/specs/mutations/login.test.js"

# Executar a suíte em ambiente de QA / Staging (sobrescrevendo a URL base)
API_URL=[https://qa-api.paymentcontrol.com](https://qa-api.paymentcontrol.com) npx mocha --recursive "test/specs/**/*.test.js"
```

### Geração de Relatórios (Mochawesome)
O projeto conta com integração ao Mochawesome para a geração automática de relatórios visuais detalhados em HTML e JSON das execuções de testes, salvos no diretório `mochawesome-report/`.

### Análise Estática de Código (Linting)

```bash
# Executar a validação do ESLint em todo o projeto
npm run lint
```

---

## 🏛️ Padrões de Arquitetura de Testes e Qualidade

| Padrão / Camada | Descrição e Aplicação no Projeto |
| :--- | :--- |
| **Isolamento de Ambiente** | Centralização da URL base em `test/config/env.js`, permitindo alternar entre `localhost`, `QA` e `Staging` via variáveis de ambiente. |
| **Data Factories** | Uso do `@faker-js/faker` no `funcionarioFactory.js` para gerar dados únicos a cada execução, prevenindo falso-positivos por dados duplicados. |
| **Massa Determinística** | Uso de dados estáticos para testes específicos de validação de login (`admin@admin.com`). |
| **Authentication Helpers** | O arquivo `authHelper.js` centraliza a obtenção de tokens JWT para reutilização no hook `before()` de endpoints protegidos. |
| **Organização por Contextos** | Estruturação dos cenários com blocos `context()` do Mocha, separando claramente testes de Sucesso, Segurança, Regras de Negócio e Validações de Schema. |
| **Tratamento de Erros GraphQL** | Separação das asserções de erro entre HTTP 200 (erros de negócio/resolução) e HTTP 400 (erros de parsing/schema estático). |
| **Relatórios Automatizados** | Emissão de relatórios estruturados (HTML/JSON) via **Mochawesome** para rastreabilidade de execuções de testes. |
| **Padronização ESLint 9 (Flat Config)** | Mapeamento nativo dos globais de testes Mocha (`describe`, `it`, `context`, `before`) no arquivo `eslint.config.mjs` via `globals.mocha`. |
| **Gestão Limpa de Variáveis** | Remoção de variáveis órfãs (`no-unused-vars`) na montagem de massas de testes via operador `delete` e uso de *Optional Catch Binding* (`catch { ... }`) na captura de erros do servidor. |