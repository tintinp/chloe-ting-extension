module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ['plugin:react/recommended', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-filename-extension': 0,
    'react/no-unknown-property': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-indent-props': [2, 2],
    'react/prop-types': 0,
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2
      }
    ],
    'no-unused-vars': ['error']
  }
}
