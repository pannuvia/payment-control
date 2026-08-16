/**
 * ARQUIVO: eslint.config.mjs
 * DESCRIÇÃO: Configuração do ESLint 9 (Flat Config).
 * 
 * RESPONSABILIDADE:
 *  - Padronizar a qualidade e estilo do código do projeto.
 *  - Mapear variáveis globais do Node.js, ES2021 e Mocha para evitar alertas de erro.
 *  - Ignorar pastas de relatórios, dependências e compilação.
 */

// Importa o conjunto de regras recomendadas nativas do ESLint
import js from "@eslint/js";

// Importa a biblioteca com definições de variáveis globais pré-configuradas (Node, ES, Mocha, etc.)
import globals from "globals";

export default [
  // Diretórios e arquivos que o ESLint NÃO deve analisar
  {
    ignores: [
      "mochawesome-report/**", // Ignora os relatórios visuais gerados pelo Mochawesome
      "coverage/**",           // Ignora relatórios de cobertura de código
      "dist/**",               // Ignora pasta de compilação/distribuição
      "node_modules/**"        // Ignora as dependências do projeto
    ]
  },

  // Regras, sintaxe e ambientes aplicados ao código JavaScript do projeto
  {
    // Aplica as regras em qualquer arquivo com extensão .js ou .mjs
    files: ["**/*.js", "**/*.mjs"],

    // Define as opções da linguagem e variáveis globais permitidas
    languageOptions: {
      ecmaVersion: "latest", // Suporta as funcionalidades mais recentes do ECMAScript/JavaScript
      sourceType: "module",  // Permite o uso de módulos ES6+ (import / export)
      globals: {
        ...globals.node,     // Reconhece globais do Node.js (ex: process, require, module, __dirname)
        ...globals.es2021,   // Reconhece estruturas globais do ES2021 (ex: Promise, Map, Set)
        ...globals.mocha     // Reconhece a sintaxe do Mocha (ex: describe, it, context, before, after)
      }
    },

    // Define quais regras de linting serão aplicadas
    rules: {
      ...js.configs.recommended.rules, // Importa todas as regras de boas práticas recomendadas do ESLint

      // Regra para variáveis não utilizadas: emite um aviso (warn) em vez de erro,
      // e ignora argumentos de funções iniciados com "_" (exemplo: _req, _res)
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  }
];