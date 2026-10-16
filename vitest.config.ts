

/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
    exclude: ['hello-cdk/**', 'node_modules/**'],
  },
});

