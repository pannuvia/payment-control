const request = require('supertest')
const { expect } = require('chai')

describe('Login - Mutation', () => {
    it('deve retornar um token com dados válidos', async () => {
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
    })
  
    it('deve falhar ao tentar login com email inválido', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
            email: 'admin#admin.com',
            senha: '123456'
          }
        })
    expect(response.status).to.equal(200)
    expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')    
    })

    it('deve falhar ao tentar login com senha inválida', async () => {
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
            senha: '1234567'
          }
        })
    expect(response.status).to.equal(200)
    expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')    
    })

    it('deve falhar ao tentar login com email vazio', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
            email: '',
            senha: '123456'
          }
        })
    expect(response.status).to.equal(200)
    expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')    
    })

    it('deve falhar ao tentar login com senha vazia', async () => {
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
            senha: ''
          }
        })
    expect(response.status).to.equal(200)
    expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')    
    })

    it('deve falhar ao tentar login com email e senha vazios', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
            email: '',
            senha: ''
          }
        })
    expect(response.status).to.equal(200)
    expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')    
    })

    it('deve falhar ao tentar login sem email', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
            senha: '123456'
          }
        })
    expect(response.status).to.equal(400)
    expect(response.body.errors[0]).to.have.property('message', 'Variable \"$email\" of required type \"String!\" was not provided.')    
    })

    it('deve falhar ao tentar login sem senha', async () => {
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
          }
        })
    expect(response.status).to.equal(400)
    expect(response.body.errors[0]).to.have.property('message', 'Variable \"$senha\" of required type \"String!\" was not provided.')    
    })

    it('deve falhar ao tentar login sem email e senha', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
          }
        })
    expect(response.status).to.equal(400)
        expect(response.body.errors[0]).to.have.property('message', 'Variable \"$email\" of required type \"String!\" was not provided.')   
    })

    it('deve falhar ao tentar login com email nulo', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
            email: null,
            senha: '123456'
          }
        })
    expect(response.status).to.equal(400)
        expect(response.body.errors[0]).to.have.property('message', 'Variable \"$email\" of non-null type \"String!\" must not be null.')   
    })

    it('deve falhar ao tentar login com senha nula', async () => {
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
            senha: null
          }
        })
    expect(response.status).to.equal(400)
        expect(response.body.errors[0]).to.have.property('message', 'Variable \"$senha\" of non-null type \"String!\" must not be null.')   
    })

    it('deve falhar ao tentar login com email e senha nulos', async () => {
    const response = await request('http://localhost:4000')
        .post('/graphql')
        .send({
          query: `mutation Login($email: String!, $senha: String!) {
              login(email: $email, senha: $senha) {
                token
              }
            }`,
          variables: {
            email: null,
            senha: null
          }
        })
    expect(response.status).to.equal(400)
        expect(response.body.errors[0]).to.have.property('message', 'Variable \"$email\" of non-null type \"String!\" must not be null.')   
    })

    it('deve retornar sucesso com token não vazio', async () => {
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
    expect(response.status).to.equal(200)
    expect(response.body.data.login.token).to.not.be.empty
    })

    it('deve retornar erro com token inválido', async () => {
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
    expect(response.status).to.equal(200)
    expect(response.body.data.login.token).to.not.include('eyJh00000bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    })
})