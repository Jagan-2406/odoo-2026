import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { RoleProvider } from '../context/RoleContext';
import { AppRoutes } from '../routes';

/**
 * Root Application Entry component.
 * Sets up global QueryClient, BrowserRouter routing, and developer simulated role providers.
 */
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RoleProvider>
    </QueryClientProvider>
  );
};
export default App;
