import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
    {
        ignores: ['.astro/**', 'dist/**','hello-cdk/**','cdk.out'],
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

