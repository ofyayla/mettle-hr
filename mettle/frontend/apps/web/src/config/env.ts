// Environment configuration with type safety
interface EnvConfig {
    apiUrl: string;
    apiTimeout: number;
    sentryDsn: string;
    analyticsId: string;
    environment: 'development' | 'staging' | 'production';
    isDevelopment: boolean;
    isProduction: boolean;
}

function getEnvConfig(): EnvConfig {
    const environment = (import.meta.env.VITE_ENV as EnvConfig['environment']) || 'development';

    return {
        apiUrl: import.meta.env.VITE_API_URL || '/api',
        apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
        sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
        analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
        environment,
        isDevelopment: environment === 'development',
        isProduction: environment === 'production'
    };
}

export const env = getEnvConfig();

// Type declarations for import.meta.env
declare global {
    interface ImportMetaEnv {
        VITE_API_URL?: string;
        VITE_API_TIMEOUT?: string;
        VITE_SENTRY_DSN?: string;
        VITE_ANALYTICS_ID?: string;
        VITE_ENV?: 'development' | 'staging' | 'production';
    }
}
