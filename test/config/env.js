/**
 * ARQUIVO: test/config/env.js
 * DESCRIÇÃO: Arquivo de configuração central do ambiente de testes.
 * RESPONSABILIDADE:
 *  - Centralizar a URL base e parâmetros da API (http://localhost:4000).
 *  - Permitir, caso necessario, a troca de ambientes (Local, QA, Staging) via variável de ambiente (process.env)
 *    sem a necessidade de alterar os testes.
 */

module.exports = {
    API_URL: process.env.API_URL || 'http://localhost:4000'
};