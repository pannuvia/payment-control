const request = require('supertest')
const { expect } = require('chai')

// 1. Importa o helper de autenticação
const { obterToken } = require('../../helpers/authHelper');

// 2. Importa a factory e a mutation do arquivo funcionarioFactory.js
const { 
    MUTATION_CRIAR_FUNCIONARIO, 
    gerarMassaFuncionario 
} = require('../../fixtures/funcionarioFactory');

describe('Criar Funcionario - Mutation', () => {
   
    let token;
   
 // 3. Chama o helper
    before(async () => {
        token = await obterToken();
    });
    
    it('deve criar funcionario quando preencho os campos obrigatorios com dados válidos', async () => {
        
        const input = gerarMassaFuncionario({ desligamento: "" });
        const response = await request('http://localhost:4000')
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
        const response = await request('http://localhost:4000')
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