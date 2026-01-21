/**
 * Error Tracking Service
 * Ready for Sentry integration when DSN is provided
 */

import { env } from '@/config/env';

interface ErrorContext {
    component?: string;
    action?: string;
    userId?: string;
    extra?: Record<string, unknown>;
}

class ErrorTracker {
    private initialized = false;

    /**
     * Initialize error tracking (call once in app startup)
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        if (env.sentryDsn && env.isProduction) {
            // Dynamic import for code splitting
            try {
                const Sentry = await import('@sentry/react');
                Sentry.init({
                    dsn: env.sentryDsn,
                    environment: env.environment,
                    integrations: [
                        Sentry.browserTracingIntegration(),
                        Sentry.replayIntegration()
                    ],
                    tracesSampleRate: 0.1,
                    replaysSessionSampleRate: 0.1,
                    replaysOnErrorSampleRate: 1.0
                });
                this.initialized = true;
                console.info('[ErrorTracker] Sentry initialized');
            } catch (error) {
                console.warn('[ErrorTracker] Failed to initialize Sentry:', error);
            }
        } else {
            console.info('[ErrorTracker] Sentry not configured (no DSN or not production)');
        }
    }

    /**
     * Capture an error with context
     */
    captureError(error: Error, context?: ErrorContext): void {
        if (env.isDevelopment) {
            console.error('[ErrorTracker]', error, context);
            return;
        }

        if (this.initialized && env.sentryDsn) {
            import('@sentry/react').then(Sentry => {
                Sentry.withScope(scope => {
                    if (context?.component) scope.setTag('component', context.component);
                    if (context?.action) scope.setTag('action', context.action);
                    if (context?.userId) scope.setUser({ id: context.userId });
                    if (context?.extra) scope.setExtras(context.extra);
                    Sentry.captureException(error);
                });
            });
        }
    }

    /**
     * Capture a message (non-error event)
     */
    captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
        if (env.isDevelopment) {
            console.log(`[ErrorTracker:${level}]`, message);
            return;
        }

        if (this.initialized && env.sentryDsn) {
            import('@sentry/react').then(Sentry => {
                Sentry.captureMessage(message, level);
            });
        }
    }

    /**
     * Set user context for error tracking
     */
    setUser(userId: string, email?: string): void {
        if (this.initialized && env.sentryDsn) {
            import('@sentry/react').then(Sentry => {
                Sentry.setUser({ id: userId, email });
            });
        }
    }

    /**
     * Clear user context (on logout)
     */
    clearUser(): void {
        if (this.initialized && env.sentryDsn) {
            import('@sentry/react').then(Sentry => {
                Sentry.setUser(null);
            });
        }
    }
}

export const errorTracker = new ErrorTracker();
