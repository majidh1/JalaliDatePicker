/* eslint-disable quote-props */
// eslint-disable-next-line no-undef
module.exports = {
	root: true,
	extends: ["eslint:recommended", "plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	ignorePatterns: ["dist"],
	rules: {
		"@typescript-eslint/no-this-alias": "off",
		"@typescript-eslint/adjacent-overload-signatures": "error",
		"@typescript-eslint/array-type": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/consistent-type-assertions": "off",
		"@typescript-eslint/consistent-type-definitions": "error",
		"@typescript-eslint/dot-notation": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-member-accessibility": [
			"off",
			{
				accessibility: "explicit"
			}
		],
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/indent": [
			"error",
			"tab",
			{
				ignoredNodes: ["TSTypeParameterInstantiation"],
				SwitchCase: 1,
				FunctionDeclaration: {
					parameters: "first"
				},
				FunctionExpression: {
					parameters: "first"
				}
			}
		],
		"@typescript-eslint/member-delimiter-style": [
			"error",
			{
				multiline: {
					delimiter: "semi",
					requireLast: true
				},
				singleline: {
					delimiter: "semi",
					requireLast: false
				}
			}
		],
		"@typescript-eslint/member-ordering": [
			"error",
			{
				default: [
					// Index signature
					"signature",
					"call-signature",

					// Fields
					"public-static-field",
					"protected-static-field",
					"private-static-field",
					"#private-static-field",

					"public-decorated-field",
					"protected-decorated-field",
					"private-decorated-field",

					"public-instance-field",
					"protected-instance-field",
					"private-instance-field",
					"#private-instance-field",

					"public-abstract-field",
					"protected-abstract-field",

					"public-field",
					"protected-field",
					"private-field",
					"#private-field",

					"static-field",
					"instance-field",
					"abstract-field",

					"decorated-field",

					"field",

					// Static initialization
					"static-initialization",

					// Constructors
					"public-constructor",
					"protected-constructor",
					"private-constructor",

					"constructor",

					// Methods
					"public-static-method",
					"protected-static-method",
					"private-static-method",
					"#private-static-method",

					"public-decorated-method",
					"protected-decorated-method",
					"private-decorated-method",

					"public-instance-method",
					"protected-instance-method",
					"private-instance-method",
					"#private-instance-method",

					"public-abstract-method",
					"protected-abstract-method",

					"public-method",
					"protected-method",
					"private-method",
					"#private-method",

					"static-method",
					"instance-method",
					"abstract-method",

					"decorated-method",

					"method"
				]
			}
		],
		"@typescript-eslint/naming-convention": [
			"off",
			{
				selector: "variable",
				format: ["camelCase", "UPPER_CASE", "PascalCase"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid"
			}
		],
		"@typescript-eslint/no-empty-function": "warn",
		"@typescript-eslint/no-empty-interface": "error",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-inferrable-types": [
			"error",
			{
				ignoreParameters: true
			}
		],
		"@typescript-eslint/no-misused-new": "error",
		"@typescript-eslint/no-namespace": "error",
		"@typescript-eslint/no-non-null-assertion": "error",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-shadow": [
			"error",
			{
				hoist: "all"
			}
		],
		"@typescript-eslint/no-unused-expressions": "error",
		"@typescript-eslint/no-use-before-define": "error",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/prefer-function-type": "error",
		"@typescript-eslint/prefer-namespace-keyword": "error",
		"@typescript-eslint/quotes": ["error", "double"],
		"@typescript-eslint/semi": ["error", "always"],
		"@typescript-eslint/triple-slash-reference": [
			"error",
			{
				path: "always",
				types: "prefer-import",
				lib: "always"
			}
		],
		"@typescript-eslint/type-annotation-spacing": "error",
		"@typescript-eslint/typedef": "off",
		"@typescript-eslint/unified-signatures": "off",
		"arrow-body-style": "error",
		"arrow-parens": ["off", "always"],
		"brace-style": ["error", "1tbs"],
		"comma-dangle": "error",
		complexity: "off",
		"constructor-super": "error",
		"dot-notation": "off",
		eqeqeq: ["error", "smart"],
		"id-denylist": ["error", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"],
		"id-match": "error",
		"import/order": "off",
		indent: "off",
		"max-len": [
			"warn",
			{
				code: 170,
				tabWidth: 2,
				ignoreStrings: true,
				ignoreComments: true
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
	},
	settings: {}
};
