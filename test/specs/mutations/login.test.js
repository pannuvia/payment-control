/**
 * ARQUIVO: test/specs/mutations/login.test.js
 * DESCRIÇÃO: Suíte de testes automatizados para a mutation 'login'.
 * 
 * COMO UTILIZA OS OUTROS ARQUIVOS DA ARQUITETURA:
 * 
 * 1. `config/env.js`:
 *    - Fornece a `API_URL` centralizada para o Supertest saber para qual servidor disparar as requisições HTTP.
 * 
 * 2. `Helpers e Fixtures (Isolamento por Arquitetura)`:
 *    - Não utiliza `helpers/authHelper.js` por ser o próprio ponto gerador do token (evita dependência circular).
 *    - Não utiliza `fixtures` dinâmicas porque os testes de login exigem massa de dados fixa e determinística (credenciais válidas conhecidas e cenários de erro específicos).
 * 
 * 3. `Supertest & Chai`:
 *    - O Supertest dispara as requisições POST para o endpoint `/graphql` enviando a mutation e as variáveis.
 *    - O Chai valida a emissão do token JWT nos cenários de sucesso, as mensagens de erro em validações de negócio (status 200) e os erros de validação do schema GraphQL (status 400).
 */

const request = require('supertest');
const { expect } = require('chai');
const { API_URL } = require('../../config/env');

const MUTATION_LOGIN = `
  mutation Login($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) {
      token
    }
  }`;

const enviarLogin = (variables) => {
  return request(API_URL)
    .post('/graphql')
    .send({
      query: MUTATION_LOGIN,
      variables
    });
};

describe('Login - Mutation', () => {

  context('Cenário de Sucesso', () => {
    it('deve autenticar com sucesso e retornar um token JWT válido', async () => {
      const response = await enviarLogin({
        email: 'admin@admin.com',
        senha: '123456'
      });

      expect(response.status).to.equal(200);
      expect(response.body.errors).to.be.undefined;
      expect(response.body.data.login).to.have.property('token');
      expect(response.body.data.login.token).to.be.a('string').that.is.not.empty;
    });
  });

  context('Cenário de Falha - Regras de Negócio (Status HTTP 200 com erro na resposta)', () => {
    it('deve falhar ao tentar login com email inválido', async () => {
      const response = await enviarLogin({
        email: 'admin#admin.com',
        senha: '123456'
      });
      expect(response.status).to.equal(200);
      expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });

    it('deve falhar ao tentar login com senha inválida', async () => {
      const response = await enviarLogin({
        email: 'admin@admin.com',
        senha: '1234567'
      });
      expect(response.status).to.equal(200);
      expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });

    it('deve falhar ao tentar login com email vazio', async () => {
      const response = await enviarLogin({
        email: '',
        senha: '123456'
      });
      expect(response.status).to.equal(200);
      expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });

    it('deve falhar ao tentar login com senha vazia', async () => {
      const response = await enviarLogin({
        email: 'admin@admin.com',
        senha: ''
      });
      expect(response.status).to.equal(200);
      expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });

    it('deve falhar ao tentar login com email e senha vazios', async () => {
      const response = await enviarLogin({
        email: '',
        senha: ''
      });
      expect(response.status).to.equal(200);
      expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });
  });

  context('Cenário de Falha - Schema GraphQL (Status HTTP 400)', () => {
    it('deve falhar ao tentar login sem enviar o campo email', async () => {
      const response = await enviarLogin({
        senha: '123456'
      });
      expect(response.status).to.equal(400);
      expect(response.body.errors[0]).to.have.property('message', 'Variable "$email" of required type "String!" was not provided.');
    });

    it('deve falhar ao tentar login sem enviar o campo senha', async () => {
      const response = await enviarLogin({
        email: 'admin@admin.com'
      });
      expect(response.status).to.equal(400);
      expect(response.body.errors[0]).to.have.property('message', 'Variable "$senha" of required type "String!" was not provided.');
    });

    it('deve falhar ao tentar login com email nulo', async () => {
      const response = await enviarLogin({
        email: null,
        senha: '123456'
      });
      expect(response.status).to.equal(400);
      expect(response.body.errors[0]).to.have.property('message', 'Variable "$email" of non-null type "String!" must not be null.');
    });

    it('deve falhar ao tentar login com senha nula', async () => {
      const response = await enviarLogin({
        email: 'admin@admin.com',
        senha: null
      });
      expect(response.status).to.equal(400);
      expect(response.body.errors[0]).to.have.property('message', 'Variable "$senha" of non-null type "String!" must not be null.');
    });
  });
});