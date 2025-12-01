import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

global.import = {
  meta: {
    env: {
      VITE_CLERK_PUBLISHABLE_KEY: 'pk_test_mock_key_for_testing',
    },
  },
};