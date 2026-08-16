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

// Importa o cliente HTTP Supertest para requisições de API
const supertest = require('supertest');

// Importa a biblioteca de asserções BDD Chai
const { expect } = require('chai');

// Importa a URL base configurada para o ambiente
const { API_URL } = require('../../config/env');

// Importa o helper de autenticação para obtenção prévia do token JWT
const { obterToken } = require('../../helpers/authHelper');

// Importa a mutation GraphQL e a factory de dados para geração de funcionários
const { MUTATION_CRIAR_FUNCIONARIO, gerarMassaFuncionario } = require('../../fixtures/funcionarioFactory');

// Bloco da suíte de testes da mutation de Criar Funcionário
describe('Criar Funcionário - Mutation GraphQL', () => {
  let token;

  // Hook executado uma vez antes de iniciar os testes da suíte para obter o token JWT de admin
  before(async () => {
    token = await obterToken();
  });

  /**
   * Helper local para disparar a requisição de criação de funcionário com os headers de autorização
   * @param {Object} input - Dados do funcionário a serem enviados
   * @param {string|null} tokenHeader - Token JWT para o header Authorization (padrão: token obtido no before)
   */
  const executarCriarFuncionario = (input, tokenHeader = token) => {
    const req = supertest(API_URL).post('/graphql');
    
    // Anexa o cabeçalho Bearer Token caso um token válido seja repassado
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
      // Cria a massa e remove o campo opcional desligamento
      const massaObrigatoria = gerarMassaFuncionario();
      delete massaObrigatoria.desligamento;

      const response = await executarCriarFuncionario(massaObrigatoria);

      expect(response.status).to.equal(200);
      expect(response.body.data.criarFuncionario).to.have.property('id');
      expect(response.body.data.criarFuncionario.nome).to.equal(massaObrigatoria.nome);
    });

    it('deve criar um funcionário com todos os campos preenchidos', async () => {
      // Cria a massa completa incluindo campos opcionais
      const massa = gerarMassaFuncionario();
      const response = await executarCriarFuncionario(massa);

      expect(response.status).to.equal(200);
      expect(response.body.data.criarFuncionario.cpf).to.equal(massa.cpf);
    });
  });

  context('Cenários de Falha - Segurança e Autenticação', () => {
    it('deve falhar ao tentar criar funcionário sem token de autorização', async () => {
      const massa = gerarMassaFuncionario();
      // Executa enviando null no token do header
      const response = await executarCriarFuncionario(massa, null);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/autenticação|não autorizado|autorização|token|unauthorized/i);
    });

    it('deve falhar ao tentar criar funcionário com token inválido', async () => {
      const massa = gerarMassaFuncionario();
      const tokenInvalido = 'eyJhYmdjL29wZW5haS1pbnZhbGlkLXRva2Vu.payload.signature';
      // Executa enviando uma assinatura JWT corrompida
      const response = await executarCriarFuncionario(massa, tokenInvalido);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/autenticação|não autorizado|autorização|token|unauthorized/i);
    });
  });

  context('Cenários de Falha - Regras de Negócio (Status HTTP 200 com erro na resposta)', () => {
    it('deve falhar ao tentar cadastrar funcionário já existente (CPF duplicado)', async () => {
      const massaBase = gerarMassaFuncionario();
      
      // Cadastra o primeiro funcionário para ocupar o CPF
      await executarCriarFuncionario(massaBase);

      // Tenta cadastrar um segundo funcionário com o mesmo CPF
      const massaDuplicada = gerarMassaFuncionario({ cpf: massaBase.cpf });
      const response = await executarCriarFuncionario(massaDuplicada);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/cpf|já cadastrado|existente|duplicado/i);
    });

    it('deve falhar ao tentar cadastrar funcionário com salário zero ou negativo', async () => {
      // Sobrescreve o salário base com um valor negativo
      const massaSalarioInvalido = gerarMassaFuncionario({ salario_base: -1500.00 });
      const response = await executarCriarFuncionario(massaSalarioInvalido);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/salário|salario|inválido|maior que zero/i);
    });

    it('deve falhar ao tentar cadastrar funcionário com data de desligamento anterior à admissão', async () => {
      // Sobrescreve datas criando uma incoerência temporal
      const massaDatasIncoerentes = gerarMassaFuncionario({
        admissao: '2026-06-01',
        desligamento: '2026-01-01'
      });
      const response = await executarCriarFuncionario(massaDatasIncoerentes);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/desligamento|admissão|data/i);
    });

    it('deve falhar ao tentar cadastrar funcionário com data de admissão no futuro distante', async () => {
      // Sobrescreve a data de admissão para o ano de 2099
      const massaDataFutura = gerarMassaFuncionario({ admissao: '2099-01-01' });
      const response = await executarCriarFuncionario(massaDataFutura);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/admissão|futuro|inválida|data/i);
    });

    it('deve falhar ao tentar cadastrar funcionário com nome contendo apenas espaços', async () => {
      // Sobrescreve o nome apenas com caracteres de espaço em branco
      const massaNomeEspacos = gerarMassaFuncionario({ nome: '   ' });
      const response = await executarCriarFuncionario(massaNomeEspacos);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].message).to.match(/nome|obrigatório|inválido/i);
    });
  });

  context('Cenários de Falha - Schema GraphQL (HTTP 400)', () => {
    it('deve falhar ao omitir o campo obrigatório cpf', async () => {
      const massaSemCpf = gerarMassaFuncionario();
      delete massaSemCpf.cpf;

      const response = await executarCriarFuncionario(massaSemCpf);

      expect(response.status).to.equal(400);
      expect(response.body.errors[0].message).to.match(/Field "cpf"|was not provided/i);
    });

    it('deve falhar ao omitir o campo obrigatório nome', async () => {
      const massaSemNome = gerarMassaFuncionario();
      delete massaSemNome.nome;

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
      // Tenta enviar uma string no lugar de um Float/Int
      const massaTipoIncorreto = gerarMassaFuncionario({ salario_base: 'texto_invalido' });
      const response = await executarCriarFuncionario(massaTipoIncorreto);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('errors');
    });

    it('deve falhar ao passar data de admissao em formato invalido', async () => {
      // Envia formato DD/MM/YYYY em vez do padrão aceito YYYY-MM-DD
      const massaDataInvalida = gerarMassaFuncionario({ admissao: '31/12/2026' });
      const response = await executarCriarFuncionario(massaDataInvalida);

      expect(response.body).to.have.property('errors');
    });
  });
});