import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      semi: 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '**/*.js'],
  },
)
