/**
 * Network simulation utilities for frontend development and testing.
 * Simulates latency, timeout, and random network failures.
 */

export interface NetworkSimulationConfig {
  latencyMs: number;
  failureRate: number; // 0 to 1 (e.g., 0.05 = 5% chance of failure)
  timeoutRate: number; // 0 to 1
}

// Global simulation config
const config: NetworkSimulationConfig = {
  latencyMs: 300,
  failureRate: 0, // Disabled by default for smooth development
  timeoutRate: 0,
};

export const mockNetworkConfig = {
  setLatency: (ms: number) => { config.latencyMs = ms; },
  setFailureRate: (rate: number) => { config.failureRate = rate; },
  setTimeoutRate: (rate: number) => { config.timeoutRate = rate; },
  getConfig: () => ({ ...config }),
};

export const simulateNetwork = async (): Promise<void> => {
  // 1. Check for simulated Timeout
  if (config.timeoutRate > 0 && Math.random() < config.timeoutRate) {
    await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Network request timeout (Simulated)'));
      }, 5000);
    });
  }

  // 2. Check for simulated Server Failure
  if (config.failureRate > 0 && Math.random() < config.failureRate) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('Internal Server Error 500 (Simulated)');
  }

  // 3. Normal latency delay
  if (config.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, config.latencyMs));
  }
};
