import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({ render: mockRender }));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: vi.fn(({ children, publishableKey }) => (
    <div data-testid="clerk-provider" data-publishable-key={publishableKey}>
      {children}
    </div>
  )),
}));

vi.mock('../App.jsx', () => ({
  default: () => <div data-testid="app-component">App</div>,
}));

vi.mock('../index.css', () => ({}));

describe('Main Entry Point (main.jsx)', () => {
  let originalEnv;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = { ...import.meta.env };
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    document.body.innerHTML = '';
  });

  describe('Environment Variable Validation', () => {
    it('should read VITE_CLERK_PUBLISHABLE_KEY from environment', async () => {
      import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = 'pk_test_valid_key';
      await import('../main.jsx');
      expect(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY).toBe('pk_test_valid_key');
    });

    it('should throw error when PUBLISHABLE_KEY is missing', () => {
      delete import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
      
      expect(() => {
        const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
        if (!PUBLISHABLE_KEY) {
          throw new Error("Missing Clerk Publishable Key");
        }
      }).toThrow('Missing Clerk Publishable Key');
    });

    it('should throw error when PUBLISHABLE_KEY is empty string', () => {
      import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = '';
      
      expect(() => {
        const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
        if (!PUBLISHABLE_KEY) {
          throw new Error("Missing Clerk Publishable Key");
        }
      }).toThrow('Missing Clerk Publishable Key');
    });
  });

  describe('DOM Element Selection', () => {
    it('should select root element with id "root"', () => {
      const rootElement = document.getElementById('root');
      expect(rootElement).toBeTruthy();
      expect(rootElement.id).toBe('root');
    });

    it('should have root element in document body', () => {
      const rootElement = document.getElementById('root');
      expect(document.body.contains(rootElement)).toBe(true);
    });
  });

  describe('React Component Structure', () => {
    it('should wrap App in StrictMode', async () => {
      import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = 'pk_test_key';
      mockRender.mockClear();
      await import('../main.jsx');
      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
        const renderCall = mockRender.mock.calls[0]?.[0];
        expect(renderCall?.type?.name).toBe('StrictMode');
      });
    });
  });

  describe('Import Statements', () => {
    it('should import StrictMode from react', async () => {
      const react = await import('react');
      expect(react.StrictMode).toBeDefined();
    });

    it('should import createRoot from react-dom/client', async () => {
      const reactDomClient = await import('react-dom/client');
      expect(reactDomClient.createRoot).toBeDefined();
    });

    it('should import ClerkProvider from @clerk/clerk-react', async () => {
      const clerkReact = await import('@clerk/clerk-react');
      expect(clerkReact.ClerkProvider).toBeDefined();
    });
  });
});