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

const request = require('supertest');
const { expect } = require('chai');
const { API_URL } = require('../../config/env');
const { obterToken } = require('../../helpers/authHelper');
const { MUTATION_CRIAR_FUNCIONARIO, gerarMassaFuncionario } = require('../../fixtures/funcionarioFactory');

describe('Criar Funcionario - Mutation', () => {
   
    let token;
   
    before(async () => {
        token = await obterToken();
    });
    
    it('deve criar funcionario quando preencho os campos obrigatorios com dados válidos', async () => {
        
        const input = gerarMassaFuncionario({ desligamento: "" });
        const response = await request(API_URL)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: MUTATION_CRIAR_FUNCIONARIO,
                variables: { input }
            });
       
        expect(response.status).to.equal(200);
        expect(response.body.errors).to.be.undefined;
        expect(response.body.data.criarFuncionario).to.have.property('id');
                
    })
    
    it('deve criar funcionario quando preencho todos os campos com dados válidos', async () => {
     
        const input = gerarMassaFuncionario();
        const response = await request(API_URL)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: MUTATION_CRIAR_FUNCIONARIO,
                variables: { input }
            });

        expect(response.status).to.equal(200);
        expect(response.body.errors).to.be.undefined;
        expect(response.body.data.criarFuncionario).to.have.property('id');

    })
})