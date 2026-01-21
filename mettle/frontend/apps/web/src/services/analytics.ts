/**
 * Analytics Service
 * Ready for integration with GA4 or similar when ID is provided
 */

import { env } from '@/config/env';

type EventCategory = 'navigation' | 'interaction' | 'conversion' | 'error';

interface AnalyticsEvent {
    category: EventCategory;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, unknown>;
}

class Analytics {
    private initialized = false;

    /**
     * Initialize analytics (call once in app startup)
     */
    init(): void {
        if (this.initialized) return;

        if (env.analyticsId && env.isProduction) {
            // Google Analytics 4 initialization would go here
            // For now, we'll just log that it would be initialized
            console.info('[Analytics] Would initialize with ID:', env.analyticsId);
            this.initialized = true;
        } else {
            console.info('[Analytics] Not configured (no ID or not production)');
        }
    }

    /**
     * Track a page view
     */
    pageView(path: string, title?: string): void {
        if (env.isDevelopment) {
            console.log('[Analytics:pageView]', { path, title });
            return;
        }

        if (this.initialized) {
            // gtag('event', 'page_view', { page_path: path, page_title: title });
        }
    }

    /**
     * Track a custom event
     */
    event(event: AnalyticsEvent): void {
        if (env.isDevelopment) {
            console.log('[Analytics:event]', event);
            return;
        }

        if (this.initialized) {
            // gtag('event', event.action, {
            //     event_category: event.category,
            //     event_label: event.label,
            //     value: event.value,
            //     ...event.metadata
            // });
        }
    }

    /**
     * Track user identification (after login)
     */
    identify(userId: string): void {
        if (env.isDevelopment) {
            console.log('[Analytics:identify]', userId);
            return;
        }

        if (this.initialized) {
            // gtag('config', env.analyticsId, { user_id: userId });
        }
    }

    // Pre-defined event helpers

    trackCandidateView(candidateId: string): void {
        this.event({
            category: 'interaction',
            action: 'view_candidate',
            label: candidateId
        });
    }

    trackJobView(jobId: string): void {
        this.event({
            category: 'interaction',
            action: 'view_job',
            label: jobId
        });
    }

    trackCandidateCreate(): void {
        this.event({
            category: 'conversion',
            action: 'create_candidate'
        });
    }

    trackJobCreate(): void {
        this.event({
            category: 'conversion',
            action: 'create_job'
        });
    }

    trackSearch(query: string, resultCount: number): void {
        this.event({
            category: 'interaction',
            action: 'search',
            label: query,
            value: resultCount
        });
    }
}

export const analytics = new Analytics();
