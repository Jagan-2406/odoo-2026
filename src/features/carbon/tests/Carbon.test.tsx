import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from '../../../context/RoleContext';
import { CarbonPage } from '../pages/CarbonPage';
import { mockStorage } from '../../../services/mockStorage';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>{children}</RoleProvider>
    </QueryClientProvider>
  );
};

describe('Carbon Management Module Integration Tests', () => {
  beforeEach(() => {
    mockStorage.resetDatabase();
  });

  it('should render Carbon Dashboard views with scope summaries by default', async () => {
    render(<CarbonPage />, { wrapper: createWrapper() });

    const totalEmissionsTitle = await screen.findByText('Total Emissions YTD');
    expect(totalEmissionsTitle).toBeInTheDocument();

    const scope1Title = await screen.findByText('Scope 1 Direct');
    expect(scope1Title).toBeInTheDocument();
  });

  it('should switch tabs and render Carbon logs list correctly', async () => {
    render(<CarbonPage />, { wrapper: createWrapper() });

    const logsTabButton = await screen.findByRole('button', { name: /Logs Ledger/i });
    expect(logsTabButton).toBeInTheDocument();

    fireEvent.click(logsTabButton);

    const ledgerHeading = await screen.findByText('Historical Transactions Ledger');
    expect(ledgerHeading).toBeInTheDocument();
  });

  it('should open the log carbon transaction modal form on button click', async () => {
    render(<CarbonPage />, { wrapper: createWrapper() });

    const logEmissionsBtn = await screen.findByRole('button', { name: /Log Emissions/i });
    expect(logEmissionsBtn).toBeInTheDocument();

    fireEvent.click(logEmissionsBtn);

    // Verify modal header is visible
    const modalHeader = await screen.findByText('Log Carbon Transaction');
    expect(modalHeader).toBeInTheDocument();

    // Verify inputs are loaded
    const activityInput = await screen.findByLabelText(/Activity Quantity/i);
    expect(activityInput).toBeInTheDocument();
  });
});
