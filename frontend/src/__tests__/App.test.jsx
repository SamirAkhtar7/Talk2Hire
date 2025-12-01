import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';

vi.mock('@clerk/clerk-react', () => ({
  SignedIn: vi.fn(({ children }) => <div data-testid="signed-in">{children}</div>),
  SignedOut: vi.fn(({ children }) => <div data-testid="signed-out">{children}</div>),
  SignInButton: vi.fn(({ children, mode }) => (
    <div data-testid="sign-in-button" data-mode={mode}>{children}</div>
  )),
  SignOutButton: vi.fn(({ children }) => (
    <div data-testid="sign-out-button">{children}</div>
  )),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering - Happy Path', () => {
    it('should render without crashing', () => {
      render(<App />);
      expect(screen.getByText('Welcome to the app')).toBeInTheDocument();
    });

    it('should display welcome heading', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Welcome to the app');
    });

    it('should render SignedOut component', () => {
      render(<App />);
      expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    });

    it('should render SignedIn component', () => {
      render(<App />);
      expect(screen.getByTestId('signed-in')).toBeInTheDocument();
    });
  });

  describe('SignInButton Configuration', () => {
    it('should render SignInButton inside SignedOut', () => {
      render(<App />);
      const signedOutSection = screen.getByTestId('signed-out');
      const signInButton = screen.getByTestId('sign-in-button');
      expect(signedOutSection).toContainElement(signInButton);
    });

    it('should render login button with correct text', () => {
      render(<App />);
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent('login');
    });

    it('should pass mode="modal" to SignInButton', () => {
      render(<App />);
      const signInButton = screen.getByTestId('sign-in-button');
      expect(signInButton).toHaveAttribute('data-mode', 'modal');
    });
  });

  describe('Component Structure', () => {
    it('should wrap content in React Fragment', () => {
      const { container } = render(<App />);
      expect(container.firstChild.childNodes.length).toBeGreaterThan(1);
    });

    it('should export App as default', () => {
      expect(App).toBeDefined();
      expect(typeof App).toBe('function');
    });
  });
});