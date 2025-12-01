import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';

// Mock the env module before importing db
jest.unstable_mockModule('../env.js', () => ({
  ENV: {
    DB_URI: 'mongodb://localhost:27017/test-db',
    PORT: 3000,
    NODE_ENV: 'test'
  }
}));

// Mock mongoose
jest.mock('mongoose', () => ({
  default: {
    connect: jest.fn()
  }
}));

// Import after mocking
const { connectDB } = await import('../db.js');

describe('Database Connection (db.js)', () => {
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

  describe('connectDB - Happy Path', () => {
    it('should successfully connect to MongoDB with valid URI', async () => {
      mongoose.connect.mockResolvedValueOnce(undefined);
      await connectDB();
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test-db', {});
      expect(consoleLogSpy).toHaveBeenCalledWith('✔️ MongoDB connected successfully');
    });

    it('should pass empty options object to mongoose.connect', async () => {
      mongoose.connect.mockResolvedValueOnce(undefined);
      await connectDB();
      const callArgs = mongoose.connect.mock.calls[0];
      expect(callArgs[1]).toEqual({});
    });

    it('should log success message with correct emoji', async () => {
      mongoose.connect.mockResolvedValueOnce(undefined);
      await connectDB();
      const logMessage = consoleLogSpy.mock.calls[0][0];
      expect(logMessage).toContain('✔️');
      expect(logMessage).toContain('MongoDB connected successfully');
    });
  });

  describe('connectDB - Error Handling', () => {
    it('should handle connection timeout error gracefully', async () => {
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'MongoTimeoutError';
      mongoose.connect.mockRejectedValueOnce(timeoutError);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ MongoDB connection error:',
        timeoutError
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle authentication error', async () => {
      const authError = new Error('Authentication failed');
      authError.name = 'MongoAuthError';
      mongoose.connect.mockRejectedValueOnce(authError);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ MongoDB connection error:',
        authError
      );
    });

    it('should handle network error', async () => {
      const networkError = new Error('ECONNREFUSED');
      networkError.code = 'ECONNREFUSED';
      mongoose.connect.mockRejectedValueOnce(networkError);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ MongoDB connection error:',
        networkError
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should exit process with code 1 on any error', async () => {
      const genericError = new Error('Generic connection error');
      mongoose.connect.mockRejectedValueOnce(genericError);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow('process.exit(1)');

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(processExitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('connectDB - Edge Cases', () => {
    it('should handle undefined error object', async () => {
      mongoose.connect.mockRejectedValueOnce(undefined);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ MongoDB connection error:',
        undefined
      );
    });

    it('should handle null error object', async () => {
      mongoose.connect.mockRejectedValueOnce(null);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow('process.exit(1)');
    });
  });

  describe('connectDB - Function Characteristics', () => {
    it('should be an async function', () => {
      expect(connectDB.constructor.name).toBe('AsyncFunction');
    });

    it('should return a Promise', () => {
      mongoose.connect.mockResolvedValueOnce(undefined);
      const result = connectDB();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should be exported as named export', async () => {
      const module = await import('../db.js');
      expect(module.connectDB).toBeDefined();
      expect(typeof module.connectDB).toBe('function');
    });
  });
});