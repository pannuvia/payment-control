/**
 * ARQUIVO: test/fixtures/funcionarioFactory.js
 * DESCRIÇÃO: Factory para geração de dados de teste
 * 
 * RESPONSABILIDADE:
 *  - Armazenar a mutation GraphQL `CriarFuncionario`.
 *  - Usar o @faker-js/faker para gerar massas de dados dinâmicas e realistas (CPF, Nome, Salário, Datas).
 *  - Oferecer flexibilidade para sobrescrever campos específicos (overrides) em cenários de teste variados.
 */

const { fakerPT_BR: faker } = require('@faker-js/faker');

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

function gerarMassaFuncionario(overrides = {}) {
    const dataAdmissao = faker.date.past({ years: 2 });
    const dataDesligamento = faker.date.future({ years: 2, refDate: dataAdmissao });

    return {
        cpf: faker.string.numeric(11),
        nome: faker.person.fullName(),
        salario_base: parseFloat(faker.finance.amount({ min: 3000, max: 12000, dec: 2 })),
        admissao: dataAdmissao.toISOString().split('T')[0],
        desligamento: dataDesligamento.toISOString().split('T')[0],
        ...overrides
    };
}

module.exports = {
    MUTATION_CRIAR_FUNCIONARIO,
    gerarMassaFuncionario
};