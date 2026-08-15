const request = require('supertest');

const API_URL = 'http://localhost:4000';

const MUTATION_LOGIN = `
  mutation Login($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) {
      token
    }
  }`;

/**
 * Autentica um usuário na API GraphQL e retorna o Bearer Token.
 * @param {string} email - Email do usuário (padrão: admin@admin.com)
 * @param {string} senha - Senha do usuário (padrão: 123456)
 * @returns {Promise<string>} Token JWT de autenticação
 */

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