const { fakerPT_BR: faker } = require('@faker-js/faker');

// Mutation GraphQL
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

// Função que gera a massa de dados
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

// Exporta para ser usado nos arquivos de testes
module.exports = {
    MUTATION_CRIAR_FUNCIONARIO,
    gerarMassaFuncionario
};