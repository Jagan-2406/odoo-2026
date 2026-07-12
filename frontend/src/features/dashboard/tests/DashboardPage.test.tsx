import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleProvider } from '../../../context/RoleContext';
import { DashboardPage } from '../pages/DashboardPage';
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

describe('Dashboard Feature Integration Tests', () => {
  beforeEach(() => {
    mockStorage.resetDatabase();
  });

  it('should render the ESG Score overview callout card with weighted score', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });

    // Wait for the overall score callout to load
    const esgHeading = await screen.findByText('Overall ESG Rating');
    expect(esgHeading).toBeInTheDocument();

    // Check if subscores headers are present
    const pillarHeader = await screen.findByText('Pillar Scores (Weighted)');
    expect(pillarHeader).toBeInTheDocument();
  });

  it('should list recent carbon transactions logs table in desktop view', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });

    const carbonTableTitle = await screen.findByText('Recent Carbon Transactions');
    expect(carbonTableTitle).toBeInTheDocument();

    // Check for table headers (desktop view accessor)
    const dateHeader = await screen.findByText('Date');
    const sourceHeader = await screen.findByText('Source');
    expect(dateHeader).toBeInTheDocument();
    expect(sourceHeader).toBeInTheDocument();
  });

  it('should render the leaderboard widget panel', async () => {
    render(<DashboardPage />, { wrapper: createWrapper() });

    const leaderboardHeading = await screen.findByText('Top Performers Leaderboard');
    expect(leaderboardHeading).toBeInTheDocument();
  });
});
