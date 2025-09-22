import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    ignores: ["*.config.js", "./dist/**"],
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "arrow-body-style": "error",
      "arrow-parens": ["off", "always"],
      "brace-style": ["error", "1tbs"],
      "comma-dangle": "error",
      complexity: "off",
      "constructor-super": "error",
      "dot-notation": "off",
      eqeqeq: ["warn", "smart"],
      "id-denylist": [
        "error",
        "any",
        "Number",
        "number",
        "String",
        "string",
        "Boolean",
        "boolean",
        "Undefined",
        "undefined"
      ],
      "id-match": "error",
      "import/order": "off",
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
          FunctionDeclaration: {
            parameters: "first"
          },
          FunctionExpression: {
            parameters: "first"
          }
        }
      ],
      "max-len": [
        "warn",
        {
          code: 150
        }
      ],
      "new-parens": "error",
      "no-bitwise": "off",
      "no-caller": "error",
      "no-cond-assign": "error",
      "no-debugger": "error",
      "no-empty": "warn",
      "no-empty-function": "warn",
      "no-eval": "error",
      "no-fallthrough": "error",
      "no-invalid-this": "off",
      "no-multiple-empty-lines": "error",
      "no-multi-spaces": "error",
      "no-new-wrappers": "error",
      "space-in-parens": "error",
      "no-restricted-imports": "error",
      "no-shadow": "off",
      "no-throw-literal": "error",
      "no-trailing-spaces": "error",
      "no-undef-init": "error",
      "no-unsafe-finally": "error",
      "no-unused-labels": "error",
      "no-console": "warn",
      "no-var": "error",
      "no-extra-semi": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      "quote-props": ["error", "as-needed"],
      quotes: "error",
      radix: "off",
      semi: "off",
      "space-before-function-paren": [
        "error",
        {
          asyncArrow: "always",
          named: "never"
        }
      ],
      "use-isnan": "error"
    }
  }
]);
