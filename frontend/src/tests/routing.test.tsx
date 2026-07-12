import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from '../context/RoleContext';
import { AppRoutes } from '../routes';

const createTestWrapper = (initialRoute: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <AppRoutes />
        </MemoryRouter>
      </RoleProvider>
    </QueryClientProvider>
  );
};

describe('EcoSphere Routing & Shell Integration Tests', () => {
  it('should render Dashboard by default on root path redirection', async () => {
    createTestWrapper('/');
    
    // Check if Dashboard header is displayed
    const heading = await screen.findByText('Dashboard');
    expect(heading).toBeInTheDocument();
  });

  it('should navigate to Carbon Ledger page on menu button click', async () => {
    createTestWrapper('/dashboard');

    const carbonLink = await screen.findByRole('button', { name: /Carbon Ledger/i });
    expect(carbonLink).toBeInTheDocument();

    fireEvent.click(carbonLink);

    // Verify it renders Carbon Management page header
    const carbonHeader = await screen.findByText('Carbon Management');
    expect(carbonHeader).toBeInTheDocument();
  });

  it('should render 404 page for non-existent paths', async () => {
    createTestWrapper('/non-existent-page-log');

    const errorHeading = await screen.findByText('Page Not Found');
    expect(errorHeading).toBeInTheDocument();
  });
});
