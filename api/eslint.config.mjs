import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{
		ignores: ['node_modules/', '../Deploy/', 'build.js', 'eslint.config.mjs'],
	},
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: 'module',
			globals: {
				...globals.node,
			},
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.eslint.json',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/array-type': 'error',
			// when defining a type use the "interface" keyword
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/explicit-member-accessibility': [
				'off',
				// requires an accessor, like a getter or setter
				{ accessibility: 'explicit' },
			],
			// when defining types or interfaces requires the order of the members to be fields, constructors, methods
			'@typescript-eslint/member-ordering': 'error',
			'@typescript-eslint/no-empty-object-type': 'error',
			// does not allow constructors for interfaces and "new()" for classes
			'@typescript-eslint/no-misused-new': 'error',
			// allows for strict null-checking
			'@typescript-eslint/no-non-null-assertion': 'error',
			// prevents local variables shadowing (hiding) variables declared in the outer scope
			'@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
			'@typescript-eslint/no-unused-expressions': [
				'error',
				// allows ternary expressions such as "(isSmallScreen) ? pageSize = 4 : pageSize = 8;"
				{ allowTernary: true },
			],
			// can only throw "Error" objects as exceptions
			'no-throw-literal': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/unified-signatures': 'error',
			// require "{" and "}" in arrow functions
			'arrow-body-style': 'off',
			// requires "{" and "}"
			'brace-style': ['error', '1tbs',
				// allows for "{" and "}" to be on the same block
				{ allowSingleLine: true }
			],
			// require "super()" calls in constructors
			'constructor-super': 'error',
			// requires newline at the end of files
			'eol-last': 'error',
			eqeqeq: ['error', 'always'],
			// when iterating over a loop, filter the results with an "if" statement first, before manipulating the object being iterated
			'guard-for-in': 'error',
			'max-len': ['error', { code: 160 }],
			// bitwise operations can be mistaken for logical operations
			'no-bitwise': 'error',
			// does not allow the use of "arguments.caller"
			'no-caller': 'error',
			'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
			// does not allow "debugger" statements
			'no-debugger': 'error',
			// does not allow empty block statements
			'no-empty': 'error',
			// disables the use of "eval()"
			'no-eval': 'error',
			// prevents falling from one "case" to the next in "switch"
			'no-fallthrough': 'error',
			// prevents multiple " " characters
			'no-multi-spaces': 'error',
			// prevents the use of primitive wrappers as constructors, eg. "new Boolean(false)"
			'no-new-wrappers': 'error',
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'rxjs/Rx',
							message: "Please import directly from 'rxjs' instead",
						},
					],
				},
			],
			'no-trailing-spaces': 'error',
			// don't initialize variables with "undefined"
			'no-undef-init': 'error',
			// warning if identifiers have a leading "_" character, eg. "let _count;"
			'no-underscore-dangle': 'warn',
			'no-unused-labels': 'error',
			// always use "let" or "const" instead of "var"
			'no-var': 'error',
			// when a variable doesn't change, prefer the use of "const"
			'prefer-const': 'error',
			// always use single quotes
			quotes: ['error', 'single'],
			radix: 'error',
			// always require semicolons ";"
			semi: 'error',
			'spaced-comment': ['error', 'always', { markers: ['/'] }],
		},
	},
);
