import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'schemas/index': 'src/schemas/index.ts',
    'registry/index': 'src/registry/index.ts',
    'actions/index': 'src/actions/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'templates/index': 'src/templates/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
