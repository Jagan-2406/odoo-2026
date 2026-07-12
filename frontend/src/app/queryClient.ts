import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack Query Client Configuration.
 * Configures query staleness thresholds, garbage collection offsets, and window focus tracking.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
      gcTime: 10 * 60 * 1000,  // 10 minutes cache lifespan
      retry: 1,                 // Retry failing requests once
      refetchOnWindowFocus: false, // Turn off for easier mock development
      refetchOnReconnect: true,
      throwOnError: false,
    },
    mutations: {
      retry: 0,                 // Do not retry mutations automatically
    }
  }
});
