/**
 * ARQUIVO: test/helpers/authHelper.js
 * DESCRIÇÃO: Helper de autenticação.
 * 
 * RESPONSABILIDADE:
 *  - Executar a mutation de login GraphQL contra a API.
 *  - Capturar e retornar o token JWT (Bearer Token) válido.
 *  - Reutilizar a autenticação em qualquer suíte de testes de forma centralizada.
 */

// Importa o cliente HTTP Supertest para efetuar as requisições para a API
const request = require('supertest');

// Importa a URL base da API configurada de forma centralizada
const { API_URL } = require('../config/env'); 

// Definition da Mutation GraphQL parametrizada para a operação de login
const MUTATION_LOGIN = `
  mutation Login($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) {
      token
    }
  }`;

/**
 * Função assíncrona para autenticar na API e obter o token JWT.
 * 
 * @param {string} [email='admin@admin.com'] - E-mail do usuário (padrão: credencial admin)
 * @param {string} [senha='123456'] - Senha do usuário (padrão: credencial admin)
 * @returns {Promise<string>} Retorna a string do Token JWT gerado
 */
async function obterToken(email = 'admin@admin.com', senha = '123456') {
    // Realiza a chamada HTTP POST para o endpoint /graphql enviando a query e as variáveis
    const response = await request(API_URL)
        .post('/graphql')
        .send({
            query: MUTATION_LOGIN,
            variables: { email, senha }
        });

    // Verifica se o GraphQL retornou um array de erros (ex: credenciais inválidas ou erro de servidor)
    if (response.body.errors) {
        throw new Error(`Falha ao obter token de autenticação: ${JSON.stringify(response.body.errors)}`);
    }

    // Extrai e retorna apenas a string do token JWT contida na resposta da API
    return response.body.data.login.token;
}

// Exporta a função obterToken para ser reutilizada nos testes
module.exports = { obterToken };