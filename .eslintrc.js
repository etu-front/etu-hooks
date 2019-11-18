module.exports = {
  // "parserOptions": {
  //   "ecmaVersion": 6,
  //   "sourceType": "module"
  // },
  ecmaFeatures: {
    "jsx": true,
    "modules": true
  },
  parser: '@typescript-eslint/parser', //定义ESLint的解析器
  extends: ['plugin:@typescript-eslint/recommended'],//定义文件继承的子规范
  plugins: ['@typescript-eslint', 'react'],//定义了该eslint文件所依赖的插件
  globals: {
    page: true
  },
  rules: {
    'max-len': [1, 120],
    'no-console': 0,
    'comma-dangle': [2, 'never'],
    'no-underscore-dangle': 0,
    'no-alert': 0,
    'object-curly-spacing': [2, 'always'],
    'consistent-return': 0,
    'react/jsx-indent': [0, 2],
    'react/jsx-no-bind': [0],
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 2, // 显性 import React 不报 unused React 警告
    // 'react/jsx-uses-vars': 2,
    'jsx-quotes': [1, 'prefer-double'],
    'jsx-a11y/media-has-caption': 0,
    '@typescript-eslint/interface-name-prefix': 0, // 允许 interface 命名加前缀
    '@typescript-eslint/no-non-null-assertion': 0, // 允许后边增加 ！断言
    '@typescript-eslint/member-delimiter-style': [0], // 行位无需分号
    '@typescript-eslint/indent': [1, 2], // 缩进 2 空格
    '@typescript-eslint/explicit-function-return-type': [0], // 函数无需强制明确返回类型
    '@typescript-eslint/semi': [1, 'never'],
    '@typescript-eslint/no-use-before-define': [1], // 使用时还未定义
    '@typescript-eslint/no-explicit-any': [0], // 允许 any
    '@typescript-eslint/camelcase': [0], // 允许非驼峰 后端字段独有
    '@typescript-eslint/array-type': [1] // 允许 Array<T> 此类写法
  }
}
