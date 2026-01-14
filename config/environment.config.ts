/**
 * Environment Configuration
 * 
 * This file provides centralized configuration management with support for:
 * - Multiple environments (dev, staging, production)
 * - Environment variable overrides
 * - Type-safe configuration access
 */

export type Environment = "dev" | "staging" | "production";

export interface EnvironmentConfig {
  name: Environment;
  baseUrl: string;
  apiUrl?: string;
  features?: {
    enableLogging?: boolean;
    enableTracing?: boolean;
  };
}

/**
 * Environment-specific configurations
 * These can be overridden by environment variables
 */
const environments: Record<Environment, EnvironmentConfig> = {
  dev: {
    name: "dev",
    baseUrl: "https://www.tui.nl/h/nl",
    features: {
      enableLogging: true,
      enableTracing: true,
    },
  },
  staging: {
    name: "staging",
    baseUrl: "https://staging.tui.nl/h/nl", // Replace with actual staging URL
    features: {
      enableLogging: true,
      enableTracing: true,
    },
  },
  production: {
    name: "production",
    baseUrl: "https://www.tui.nl/h/nl",
    features: {
      enableLogging: false,
      enableTracing: false,
    },
  },
};

/**
 * Get the current environment from ENV variable
 * Defaults to 'dev' if not specified
 */
export function getCurrentEnvironment(): Environment {
  const env = (globalThis as any).process?.env?.TEST_ENV || "dev";
  
  if (!["dev", "staging", "production"].includes(env)) {
    console.warn(`Invalid TEST_ENV: ${env}. Defaulting to 'dev'`);
    return "dev";
  }
  
  return env as Environment;
}

/**
 * Get configuration for the current environment
 * Supports environment variable overrides:
 * - BASE_URL: Override base URL
 * - API_URL: Override API URL
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment();
  const config = { ...environments[env] };
  
  // Allow environment variable overrides
  const baseUrlOverride = (globalThis as any).process?.env?.BASE_URL;
  if (baseUrlOverride) {
    console.log(`Overriding baseUrl with BASE_URL env var: ${baseUrlOverride}`);
    config.baseUrl = baseUrlOverride;
  }
  
  const apiUrlOverride = (globalThis as any).process?.env?.API_URL;
  if (apiUrlOverride) {
    config.apiUrl = apiUrlOverride;
  }
  
  return config;
}

/**
 * Export current environment configuration
 */
export const ENV_CONFIG = getEnvironmentConfig();
