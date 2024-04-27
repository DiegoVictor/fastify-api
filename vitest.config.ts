import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'tests/coverage',
      exclude: [
        'db/**/*',
        'src/database.ts',
        'src/env.ts',
        'src/server.ts',
        'knexfile.ts',
      ],
    },
  },
});
