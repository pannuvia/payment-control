/**
 * ARQUIVO: test/fixtures/funcionarioFactory.js
 * DESCRIÇÃO: Factory para geração de dados de teste
 * 
 * RESPONSABILIDADE:
 *  - Armazenar a mutation GraphQL `CriarFuncionario`.
 *  - Usar o @faker-js/faker para gerar massas de dados dinâmicas e realistas (CPF, Nome, Salário, Datas).
 *  - Oferecer flexibilidade para sobrescrever campos específicos (overrides) em cenários de teste variados.
 */

// Importa a instância do Faker configurada especificamente com dados no padrão PT-BR (Brasil)
const { fakerPT_BR: faker } = require('@faker-js/faker');

// Mutation GraphQL parametrizada para criação de novos funcionários no sistema
const MUTATION_CRIAR_FUNCIONARIO = `
    mutation CriarFuncionario($input: CriarFuncionarioInput!) {
        criarFuncionario(input: $input) {
            id
            cpf
            nome
            salario_base
            admissao
            desligamento
        }
    }`;

/**
 * Função responsável por gerar uma massa de dados dinâmica para criação de funcionário.
 * 
 * @param {Object} [overrides={}] - Objeto opcional para sobrescrever valores padrão da massa
 * @returns {Object} Objeto no formato exigido pela mutation CriarFuncionario
 */
function gerarMassaFuncionario(overrides = {}) {
    // Gera uma data de admissão aleatória nos últimos 2 anos a partir de hoje
    const dataAdmissao = faker.date.past({ years: 2 });

    // Gera uma data de desligamento posterior à data de admissão nos próximos 2 anos
    const dataDesligamento = faker.date.future({ years: 2, refDate: dataAdmissao });

    return {
        // Gera um CPF numérico com 11 dígitos
        cpf: faker.string.numeric(11),

        // Gera um nome completo brasileiro aleatório
        nome: faker.person.fullName(),

        // Gera um valor monetário de salário entre R$ 3.000,00 e R$ 12.000,00 com 2 casas decimais
        salario_base: parseFloat(faker.finance.amount({ min: 3000, max: 12000, dec: 2 })),

        // Formata as datas para o padrão YYYY-MM-DD exigido pelo Schema GraphQL
        admissao: dataAdmissao.toISOString().split('T')[0],
        desligamento: dataDesligamento.toISOString().split('T')[0],

        // Aplica as personalizações passadas por parâmetro, permitindo testar cenários de exceção/validação
        ...overrides
    };
}

// Exporta a mutation e a função factory para utilização nos specs de teste
module.exports = {
    MUTATION_CRIAR_FUNCIONARIO,
    gerarMassaFuncionario
};