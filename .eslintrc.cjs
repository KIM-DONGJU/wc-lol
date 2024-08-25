/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'vuetify',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    'vue/html-closing-bracket-spacing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always', // void 요소에 대해 셀프 클로징 방지
          normal: 'never', // 일반 요소에 대해 셀프 클로징 방지
          component: 'always', // Vue 컴포넌트에 대해서는 항상 셀프 클로징 허용
        },
        svg: 'always', // SVG 요소에 대해서는 항상 셀프 클로징 허용
        math: 'always', // 수학 표현식에 대해서는 항상 셀프 클로징 허용
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 6,
        },
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION', // is
          'LIST_RENDERING', // v-for
          'CONDITIONALS', // v-if, v-else-if, v-else
          'RENDER_MODIFIERS', // v-once, v-pre
          'GLOBAL', // id
          'UNIQUE', // ref, key, slot
          'TWO_WAY_BINDING', // v-model
          'OTHER_DIRECTIVES', // Other directives like v-custom
          'ATTR_DYNAMIC', // :attribute, v-bind:attribute
          'ATTR_STATIC', // attribute="value"
          'EVENTS', // @event
          'CONTENT', // v-html, v-text
        ],
        alphabetical: false,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        semi: true,
        tabWidth: 2,
        singleQuote: true,
        printWidth: 100,
        trailingComma: 'es5',
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
