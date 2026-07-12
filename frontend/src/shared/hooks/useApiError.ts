import { useCallback } from 'react';

export interface NormalizedError {
  code: string;
  message: string;
  fieldErrors?: { [key: string]: string };
}

export const useApiError = () => {
  const normalizeError = useCallback((error: any): NormalizedError => {
    if (!error) {
      return { code: 'UNKNOWN', message: 'An unexpected error occurred.' };
    }

    // 1. Timeout simulation error
    if (error.message && error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: 'The connection timed out. The server took too long to respond. Please try again.',
      };
    }

    // 2. Server 500 error
    if (error.message && error.message.includes('500')) {
      return {
        code: 'SERVER_ERROR',
        message: 'Internal server error. The ESG system encountered a database transaction error.',
      };
    }

    // 3. Network offline error
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      return {
        code: 'OFFLINE',
        message: 'You are currently offline. Please check your internet connection.',
      };
    }

    // 4. Fallback default
    return {
      code: error.code || 'API_ERROR',
      message: error.message || 'Unable to complete the action. Please contact support.',
      fieldErrors: error.errors,
    };
  }, []);

  return { normalizeError };
};
export type UseApiErrorReturn = ReturnType<typeof useApiError>;
