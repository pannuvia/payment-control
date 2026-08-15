/**
 * ARQUIVO: test/helpers/authHelper.js
 * DESCRIÇÃO: Helper de autenticação.
 * RESPONSABILIDADE:
 *  - Executar a mutation de login GraphQL contra a API.
 *  - Capturar e retornar o token JWT (Bearer Token) válido.
 *  - Reutilizar a autenticação em qualquer suíte de testes de forma centralizada.
 */

const request = require('supertest');
const { API_URL } = require('../config/env'); 

const MUTATION_LOGIN = `
  mutation Login($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) {
      token
    }
  }`;

async function obterToken(email = 'admin@admin.com', senha = '123456') {
    const response = await request(API_URL)
        .post('/graphql')
        .send({
            query: MUTATION_LOGIN,
            variables: { email, senha }
        });

    if (response.body.errors) {
        throw new Error(`Falha ao obter token de autenticação: ${JSON.stringify(response.body.errors)}`);
    }

    return response.body.data.login.token;
}

module.exports = { obterToken };