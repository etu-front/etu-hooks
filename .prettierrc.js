const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  singleQuote: true,
  printWidth: 120,
  semi: false,
  bracketSpacing: true,
  trailingComma: 'none',
  tabWidth: 2
}
