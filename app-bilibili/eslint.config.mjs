import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import VueEslintParser from "vue-eslint-parser";
export default [
  // 插件放在自定义配置上方防止覆盖自定义配置
  // 插件分先后顺序，vue在ts前会导致eslint以ts语法解析vue文件
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,mjs,cjs,ts,vue}'],
    ignores: [
      'node_modules',
      'dist',
      'dist-electron',
      'release',
    ],
    languageOptions: { 
      globals: {
        ...globals.browser, 
        ...globals.node,
        ElMessage: 'readonly',  // 声明 ElMessage 是全局变量并且是只读的
        initGeetest: 'readonly'
      },
      // 解析vue整体文件
      parser: VueEslintParser,
      // 用于解析vue文件下script内的ts语法
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaFeatures: {
          jsx: true,
        },
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { allowTemplateLiterals: true }],
      '@typescript-eslint/no-unused-vars': ['error', {
        'varsIgnorePattern': '^_', // 忽略以 _ 开头的变量
        'argsIgnorePattern': '^_', // 忽略函数参数中以 _ 开头的未使用变量
        'ignoreRestSiblings': true,  // 忽略剩余参数
      }],      
      // eslint-plugin-vue 对于.vue文件的规则
      'vue/multi-word-component-names': ['error',{
        'ignores': ['index']  //在这个数组中加入需要忽略的组件名
      }],
      'vue/no-unused-vars': ["error", {
        "ignorePattern": "^_"
      }],
      '@typescript-eslint/no-explicit-any': 0,
    }
  }
];
