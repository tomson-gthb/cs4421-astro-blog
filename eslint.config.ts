import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
    {
        ignores: ['.astro/**', 'dist/**'],
    },
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    {
        files: ['**/*.astro'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
];

