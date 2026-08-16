/**
 * ARQUIVO: test/specs/mutations/criarFuncionario.test.js
 * DESCRIÇÃO: Suíte de testes automatizados para a mutation 'criarFuncionario'.
 * 
 * COMO UTILIZA OS OUTROS ARQUIVOS DA ARQUITETURA:
 * 
 * 1. `config/env.js`:
 *    - Fornece a `API_URL` centralizada para o Supertest saber para qual servidor disparar as requisições HTTP.
 * 
 * 2. `helpers/authHelper.js`:
 *    - É executado no hook `before()`, através da função `obterToken()`, para autenticar o usuário
 *      e guardar o token JWT necessário nos headers das requisições autorizadas.
 * 
 * 3. `fixtures/funcionarioFactory.js`:
 *    - Fornece a constante `MUTATION_CRIAR_FUNCIONARIO` com o corpo da query GraphQL.
 *    - Fornece a função `gerarMassaFuncionario()`, usada dentro dos `it()` para criar uma massa
 *      de dados nova e dinâmica para cada cenário de teste.
 * 
 * 4. `Supertest & Chai`:
 *    - O Supertest dispara a requisição POST com o token e as variáveis (`input`).
 *    - O Chai valida se o status HTTP retornou 200 e se o funcionário foi criado com ID.
 */

const supertest = require('supertest');
const { expect } = require('chai');
const { API_URL } = require('../../config/env');
const { obterToken } = require('../../helpers/authHelper');
const { MUTATION_CRIAR_FUNCIONARIO, gerarMassaFuncionario } = require('../../fixtures/funcionarioFactory');

describe('Criar Funcionário - Mutation GraphQL', () => {
  let token;

  before(async () => {
    token = await obterToken();
  });

  const executarCriarFuncionario = (input, tokenHeader = token) => {
    const req = supertest(API_URL).post('/graphql');
    
    if (tokenHeader) {
      req.set('Authorization', `Bearer ${tokenHeader}`);
    }

    return req.send({
      query: MUTATION_CRIAR_FUNCIONARIO,
      variables: { input }
    });
  };

  context('Cenários de Sucesso', () => {
    it('deve criar um funcionário com apenas campos obrigatórios', async () => {
      const { desligamento, ...massaObrigatoria } = gerarMassaFuncionario();
      const response = await executarCriarFuncionario(massaObrigatoria);

      expect(response.status).to.equal(200);
      expect(response.body.data.criarFuncionario).to.have.property('id');
      expect(response.body.data.criarFuncionario.nome).to.equal(massaObrigatoria.nome);
    });

    it('deve criar um funcionário com todos os campos preenchidos', async () => {
      const massa = gerarMassaFuncionario();
      const response = await executarCriarFuncionario(massa);

      expect(response.status).to.equal(200);
      expect(response.body.data.criarFuncionario.cpf).to.equal(massa.cpf);
    });
  });

  context('Cenários de Falha - Segurança e Autenticação', () => {
    it('deve falhar ao tentar criar funcionário sem token de autorização', async () => {
      const massa = gerarMassaFuncionario();
      const response = await executarCriarFuncionario(massa, null);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/autenticação|não autorizado|autorização|token|unauthorized/i);
    });

    it('deve falhar ao tentar criar funcionário com token inválido', async () => {
      const massa = gerarMassaFuncionario();
      const tokenInvalido = 'eyJhYmdjL29wZW5haS1pbnZhbGlkLXRva2Vu.payload.signature';
      const response = await executarCriarFuncionario(massa, tokenInvalido);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/autenticação|não autorizado|autorização|token|unauthorized/i);
    });
  });

  context('Cenários de Falha - Regras de Negócio (Status HTTP 200 com erro na resposta)', () => {
    it('deve falhar ao tentar cadastrar funcionário com CPF duplicado', async () => {
      const massaBase = gerarMassaFuncionario();
      
      await executarCriarFuncionario(massaBase);

      const massaDuplicada = gerarMassaFuncionario({ cpf: massaBase.cpf });
      const response = await executarCriarFuncionario(massaDuplicada);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/cpf/i);
    });
  });

  context('Cenários de Falha - Schema GraphQL (HTTP 400)', () => {
    it('deve falhar ao omitir o campo obrigatório nome', async () => {
      const { nome, ...massaSemNome } = gerarMassaFuncionario();
      const response = await executarCriarFuncionario(massaSemNome);

      expect(response.status).to.equal(400);
      expect(response.body.errors[0].message).to.match(/Field "nome"|was not provided/i);
    });

    it('deve falhar ao passar o campo nome como null', async () => {
      const massaNomeNulo = gerarMassaFuncionario({ nome: null });
      const response = await executarCriarFuncionario(massaNomeNulo);

      expect(response.status).to.equal(400);
      expect(response.body.errors[0].message).to.match(/invalid value null|must not be null/i);
    });

    it('deve falhar ao passar tipo de dado incorreto para o salario_base', async () => {
      const massaTipoIncorreto = gerarMassaFuncionario({ salario_base: "texto_invalido" });
      const response = await executarCriarFuncionario(massaTipoIncorreto);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });
  });
});