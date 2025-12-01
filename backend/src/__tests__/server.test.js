import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock all dependencies
jest.unstable_mockModule('../lib/env.js', () => ({
  ENV: {
    PORT: '3000',
    DB_URI: 'mongodb://localhost:27017/test-db',
    NODE_ENV: 'test'
  }
}));

jest.unstable_mockModule('../lib/db.js', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined)
}));

const mockListen = jest.fn((port, callback) => {
  if (callback) callback();
  return { close: jest.fn() };
});

const mockGet = jest.fn();
const mockUse = jest.fn();
const mockApp = {
  listen: mockListen,
  get: mockGet,
  use: mockUse
};

jest.unstable_mockModule('express', () => {
  const express = jest.fn(() => mockApp);
  express.static = jest.fn();
  return { default: express };
});

describe('Server (server.js)', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('Server Startup - Happy Path', () => {
    it('should call connectDB before starting server', async () => {
      const { connectDB } = await import('../lib/db.js');
      jest.resetModules();
      await import('../server.js');
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(connectDB).toHaveBeenCalled();
    });

    it('should start server on specified PORT after successful DB connection', async () => {
      jest.resetModules();
      await import('../server.js');
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockListen).toHaveBeenCalledWith('3000', expect.any(Function));
    });
  });

  describe('Server Startup - Error Handling', () => {
    it('should handle database connection failure gracefully', async () => {
      const { connectDB } = await import('../lib/db.js');
      const dbError = new Error('Database connection failed');
      connectDB.mockRejectedValueOnce(dbError);
      
      jest.resetModules();
      
      await expect(async () => {
        await import('../server.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }).rejects.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error starting server:'),
        dbError
      );
    });

    it('should exit process with code 1 on startup error', async () => {
      const { connectDB } = await import('../lib/db.js');
      connectDB.mockRejectedValueOnce(new Error('Startup failed'));
      
      jest.resetModules();
      
      await expect(async () => {
        await import('../server.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }).rejects.toThrow('process.exit(1)');
      
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });
});