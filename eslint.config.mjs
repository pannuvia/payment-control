import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "mochawesome-report/**",
      "coverage/**",
      "dist/**",
      "node_modules/**"
    ]
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.mocha // Reconhece describe, it, context, before, etc.
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  }
];