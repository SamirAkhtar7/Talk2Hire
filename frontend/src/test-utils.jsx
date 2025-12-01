import React from 'react';
import { render } from '@testing-library/react';
import { ClerkProvider } from '@clerk/clerk-react';

export function renderWithClerk(ui, options = {}) {
  const mockPublishableKey = 'pk_test_mock_key_for_testing';
  
  const Wrapper = ({ children }) => (
    <ClerkProvider publishableKey={mockPublishableKey}>
      {children}
    </ClerkProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';