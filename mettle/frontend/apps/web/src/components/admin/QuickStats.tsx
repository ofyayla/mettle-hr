import {
    FileText, Zap, CheckCircle, Timer, TrendingUp, TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
    loading: boolean;
    data: any; // Ideally typed
}

export function QuickStats({ loading, data }: QuickStatsProps) {
    const stats = [
        {
            label: 'Toplam Doküman',
            value: data?.total_documents?.toLocaleString() || '-',
            trend: data?.total_documents_trend || '-',
            trendUp: data?.total_documents_trend?.includes('+'),
            icon: FileText,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            label: 'API Çağrıları',
            value: data?.api_calls?.toLocaleString() || '-',
            trend: data?.api_calls_trend || '-',
            trendUp: true,
            icon: Zap,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10'
        },
        {
            label: 'Başarı Oranı',
            value: data?.success_rate ? `${data.success_rate}% ` : '-',
            trend: data?.success_rate_trend || '-',
            trendUp: data?.success_rate_trend?.includes('artış'),
            icon: CheckCircle,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10'
        },
        {
            label: 'Ort. Yanıt Süresi',
            value: data?.avg_response_time || '-',
            trend: data?.response_time_trend || '-',
            trendUp: data?.response_time_trend?.includes('iyileşme'), // 'iyileşme' is good (down in time)
            icon: Timer,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10'
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-3 w-24 bg-muted rounded"></div>
                                <div className="h-7 w-16 bg-muted rounded"></div>
                                <div className="h-3 w-20 bg-muted rounded"></div>
                            </div>
                            <div className="w-12 h-12 bg-muted rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className={cn("text-xs flex items-center gap-1 mt-1", stat.trendUp ? "text-green-500" : "text-green-500")}>
                                {/* Note: Original code uses green for all trends, maybe simplistic */}
                                {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>{stat.trend}</span>
                            </p>
                        </div>
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.bgColor)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
