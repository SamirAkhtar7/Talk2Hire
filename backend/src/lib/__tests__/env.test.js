import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('Environment Configuration (env.js)', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('ENV Object - Structure', () => {
    it('should export ENV object with all required properties', async () => {
      process.env.PORT = '5000';
      process.env.DB_URI = 'mongodb://testhost:27017/testdb';
      process.env.NODE_ENV = 'production';

      const { ENV } = await import('../env.js');

      expect(ENV).toHaveProperty('PORT');
      expect(ENV).toHaveProperty('DB_URI');
      expect(ENV).toHaveProperty('NODE_ENV');
    });

    it('should have exactly 3 properties', async () => {
      process.env.PORT = '3000';
      process.env.DB_URI = 'mongodb://localhost:27017/test';
      process.env.NODE_ENV = 'test';

      const { ENV } = await import('../env.js');

      const keys = Object.keys(ENV);
      expect(keys).toHaveLength(3);
    });
  });

  describe('ENV.PORT - Happy Path', () => {
    it('should read PORT from environment variable', async () => {
      process.env.PORT = '8080';
      const { ENV } = await import('../env.js');
      expect(ENV.PORT).toBe('8080');
    });

    it('should handle standard port numbers', async () => {
      process.env.PORT = '3000';
      const { ENV } = await import('../env.js');
      expect(ENV.PORT).toBe('3000');
    });
  });

  describe('ENV.PORT - Edge Cases', () => {
    it('should handle undefined PORT', async () => {
      delete process.env.PORT;
      const { ENV } = await import('../env.js');
      expect(ENV.PORT).toBeUndefined();
    });

    it('should preserve PORT as string type', async () => {
      process.env.PORT = '3000';
      const { ENV } = await import('../env.js');
      expect(typeof ENV.PORT).toBe('string');
    });
  });

  describe('ENV.DB_URI - Happy Path', () => {
    it('should read DB_URI from environment variable', async () => {
      process.env.DB_URI = 'mongodb://localhost:27017/myapp';
      const { ENV } = await import('../env.js');
      expect(ENV.DB_URI).toBe('mongodb://localhost:27017/myapp');
    });

    it('should handle MongoDB Atlas connection string', async () => {
      const atlasUri = 'mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true';
      process.env.DB_URI = atlasUri;
      const { ENV } = await import('../env.js');
      expect(ENV.DB_URI).toBe(atlasUri);
    });
  });

  describe('ENV.NODE_ENV - Happy Path', () => {
    it('should read NODE_ENV from environment variable', async () => {
      process.env.NODE_ENV = 'production';
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBe('production');
    });

    it('should handle development environment', async () => {
      process.env.NODE_ENV = 'development';
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBe('development');
    });
  });
});