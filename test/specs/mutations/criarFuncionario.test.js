const request = require('supertest')
const { expect } = require('chai')
const { fakerPT_BR: faker } = require('@faker-js/faker');

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
        
        // --- GERAÇÃO DE DADOS DINÂMICOS COM FAKER ---
        const cpfGerado = faker.string.numeric(11);
        const nomeGerado = faker.person.fullName();
        const salarioGerado = parseFloat(faker.finance.amount({ min: 3000, max: 12000, dec: 2 }));

        // 1. Gera data de admissão (ex: em algum momento nos últimos 2 anos)
        const dataAdmissao = faker.date.past({ years: 2 });
        const dataAdmissaoFormatada = dataAdmissao.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

        // 2. Gera data de desligamento no FUTURO tomando como referência (refDate) a data de admissão
        const dataDesligamento = faker.date.future({ years: 2, refDate: dataAdmissao });
        const dataDesligamentoFormatada = dataDesligamento.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        // --------------------------------------------
        
        const response = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                       id
                       cpf
                       nome
                       salario_base
                       admissao
                       desligamento
                    }
                }`,
                variables: {
                    input: {
                        cpf: cpfGerado,
                        nome: nomeGerado,
                        salario_base: salarioGerado,
                        admissao: dataAdmissaoFormatada,
                        desligamento: ""
                    }
                }
        })
        expect(response.status).to.equal(200);
        expect(response.body.data.criarFuncionario).to.have.property('id');

        // Imprime os valores no terminal para conferência
        // console.log('--- DADOS GERADOS ---');
        // console.log('Nome:', nomeGerado);
        // console.log('CPF:', cpfGerado);
        // console.log('Salário Base:', salarioGerado);
        // console.log('Admissão:', dataAdmissaoFormatada);
        // console.log('Desligamento:', dataDesligamentoFormatada);
                
    })
    
    it('deve criar funcionario quando preencho todos os campos com dados válidos', async () => {
        
        // --- GERAÇÃO DE DADOS DINÂMICOS COM FAKER ---
        const cpfGerado = faker.string.numeric(11);
        const nomeGerado = faker.person.fullName();
        const salarioGerado = parseFloat(faker.finance.amount({ min: 3000, max: 12000, dec: 2 }));

        // 1. Gera data de admissão (ex: em algum momento nos últimos 2 anos)
        const dataAdmissao = faker.date.past({ years: 2 });
        const dataAdmissaoFormatada = dataAdmissao.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

        // 2. Gera data de desligamento no FUTURO tomando como referência (refDate) a data de admissão
        const dataDesligamento = faker.date.future({ years: 2, refDate: dataAdmissao });
        const dataDesligamentoFormatada = dataDesligamento.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        // --------------------------------------------
        
        const response = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                       id
                       cpf
                       nome
                       salario_base
                       admissao
                       desligamento
                    }
                }`,
                variables: {
                    input: {
                        cpf: cpfGerado,
                        nome: nomeGerado,
                        salario_base: salarioGerado,
                        admissao: dataAdmissaoFormatada,
                        desligamento: dataDesligamentoFormatada
                    }
                }
        })
        expect(response.status).to.equal(200);
        expect(response.body.data.criarFuncionario).to.have.property('id');

        // Imprime os valores no terminal para conferência
        // console.log('--- DADOS GERADOS ---');
        // console.log('Nome:', nomeGerado);
        // console.log('CPF:', cpfGerado);
        // console.log('Salário Base:', salarioGerado);
        // console.log('Admissão:', dataAdmissaoFormatada);
        // console.log('Desligamento:', dataDesligamentoFormatada);

    })
})