const request = require('supertest')
const { expect } = require('chai')

// Importa a factory e a mutation do arquivo funcionarioFactory.js
const { 
    MUTATION_CRIAR_FUNCIONARIO, 
    gerarMassaFuncionario 
} = require('../fixtures/funcionarioFactory');

describe('Criar Funcionario - Mutation', () => {
   
    let token;
   
    before(async () => {
         const response = await request('http://localhost:4000')
                .post('/graphql')
                .send({
                  query: `mutation Login($email: String!, $senha: String!) {
                      login(email: $email, senha: $senha) {
                        token
                      }
                    }`,
                  variables: {
                    email: 'admin@admin.com',
                    senha: '123456'
                  }
                })
            expect(response.status).to.equal(200);
            expect(response.body.data.login).to.have.property('token')
            token = response.body.data.login.token;  
    })
    
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