module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint/eslint-plugin', 'jest', 'promise', 'unicorn'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:jest/recommended',
		'plugin:promise/recommended',
		'plugin:unicorn/recommended',
		'prettier'
	],
	root: true,
	env: {
		node: true,
		jest: true,
		es6: true
	},
	ignorePatterns: ['.eslintrc.js', 'node_modules/**', 'dist/**', '.*', '.prettierrc', 'prettier.config.js'],
	overrides: [
		{
			files: ['**/*.spec.ts', '**/*.mock.ts'],
			plugins: ['jest'],
			rules: {
				// Use less restricted rules on test files
				'@typescript-eslint/no-unsafe-assignment': 'on',
				'@typescript-eslint/no-unsafe-member-access': 'on',
				'@typescript-eslint/no-unsafe-call': 'on',
				'@typescript-eslint/no-explicit-any': 'on',
				'@typescript-eslint/no-unsafe-return': 'on',
				'@typescript-eslint/no-non-null-assertion': 'on',
				'jest/unbound-method': 'error',
				'jest/no-mocks-import': 'off'
			}
		}
	],
	rules: {
		// disallow semicolons
		semi: ['error', 'never'],
		'@typescript-eslint/semi': ['error', 'never'],

		// disable mandatory default export
		'import/prefer-default-export': 'off',

		// disable mandatory use of this on non static methods
		'class-methods-use-this': 'off',

		// allow unused vars with _ preffix
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-unused-vars': 'on',

		// allow console.warm and console.error
		'no-console': ['error', { allow: ['warn', 'error'] }],

		// allow undefined returns
		'unicorn/no-useless-undefined': 'off',

		// disable mandatory numeric separators
		'unicorn/numeric-separators-style': 'off',

		// allow using Array#reduce()
		'unicorn/no-array-reduce': 'off',

		// allow using Array@reduce() instead of fromEntries
		'unicorn/prefer-object-from-entries': 'off',

		// allow using Array#forEach()
		'unicorn/no-array-for-each': 'off',

		// allow using static classes
		'unicorn/no-static-only-class': 'off',

		// disable node preffix when using builtin modules
		'unicorn/prefer-node-protocol': 'off',

		// allow abreviations
		'unicorn/prevent-abbreviations': 'off',

		// allow use Array#some instead of includes
		'unicorn/prefer-includes': 'off',

		// Allow using arrow functions at the end of the scope
		'unicorn/consistent-function-scoping': 'off',

		// Allow using static as unbound method
		'@typescript-eslint/unbound-method': [
			'error',
			{
				ignoreStatic: true
			}
		],

		// Activate switch exhaustiveness relying on TypeScript
		'consistent-return': 'off',
		'default-case': 'off',
		'@typescript-eslint/switch-exhaustiveness-check': 'error'
	}
}
