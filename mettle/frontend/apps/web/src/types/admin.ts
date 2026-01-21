// Admin dashboard types

export interface QuickStatsData {
    total_documents?: number;
    total_documents_trend?: string;
    api_calls?: number;
    api_calls_trend?: string;
    success_rate?: number;
    success_rate_trend?: string;
    avg_response_time?: string;
    response_time_trend?: string;
}

export interface ActivityItem {
    type: string;
    title: string;
    description: string;
    time: string;
}

export interface FeatureUsageData {
    [feature: string]: number;
}

export interface SystemStatusData {
    status: 'healthy' | 'degraded' | 'error';
    uptime: string;
    last_restart: string;
    memory_usage: number;
    cpu_usage: number;
    pending_jobs: number;
}

export interface PerformanceTrendsData {
    hourly_usage: number[];
    hourly_counts: number[];
    peak_hour: string;
    avg_hourly: number;
}
