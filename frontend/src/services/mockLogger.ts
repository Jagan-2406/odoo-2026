/**
 * Developer console logging tool for tracking mock API request/response cycles.
 */
export const mockLogger = {
  logRequest: (method: string, endpoint: string, payload?: any) => {
    console.groupCollapsed(
      `%c[MOCK API] %c${method} %c${endpoint}`,
      'color: #10b981; font-weight: bold;',
      'color: #3b82f6; font-weight: bold;',
      'color: #a1a1aa; font-weight: normal;'
    );
    if (payload) {
      console.log('Request Payload:', payload);
    }
    console.groupEnd();
  },

  logResponse: (endpoint: string, data: any) => {
    console.groupCollapsed(
      `%c[MOCK API] %cRESPONSE %c${endpoint}`,
      'color: #10b981; font-weight: bold;',
      'color: #8b5cf6; font-weight: bold;',
      'color: #a1a1aa; font-weight: normal;'
    );
    console.log('Response Payload:', data);
    console.groupEnd();
  },

  logError: (endpoint: string, error: any) => {
    console.group(
      `%c[MOCK API] %cERROR %c${endpoint}`,
      'color: #f43f5e; font-weight: bold;',
      'color: #ef4444; font-weight: bold;',
      'color: #a1a1aa; font-weight: normal;'
    );
    console.error('Error Details:', error);
    console.groupEnd();
  }
};
