import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockStorage } from '../services/mockStorage';
import { useDashboard, useDepartments } from '../features/dashboard/hooks/useDashboard';
import { useCreateCarbonTransaction } from '../features/carbon/hooks/useCarbon';

// Helper to provide QueryClient context wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('React Query Hooks Integration Tests', () => {
  beforeEach(() => {
    mockStorage.resetDatabase();
  });

  it('useDashboard should retrieve overall scores and weights from service layers', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.environmentalScore).toBe(82.5);
    expect(result.current.data?.weights.environmental).toBe(0.4);
  });

  it('useDepartments should fetch and list all active departments successfully', async () => {
    const { result } = renderHook(() => useDepartments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(8);
    expect(result.current.data?.[0].name).toBe('Engineering');
  });

  it('useCreateCarbonTransaction should successfully complete mutation log insertion', async () => {
    const { result } = renderHook(() => useCreateCarbonTransaction(), { wrapper: createWrapper() });

    const newTxPayload = {
      date: new Date().toISOString(),
      source: 'fleet' as const,
      activityValue: 200,
      unit: 'gallons',
      departmentId: 'dept-1',
      emissionFactorId: 'ef-diesel',
    };

    result.current.mutate(newTxPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.calculatedEmissions).toBeGreaterThan(0);
  });
});
