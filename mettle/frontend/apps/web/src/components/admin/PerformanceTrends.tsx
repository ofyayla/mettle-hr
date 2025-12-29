import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceTrendsProps {
    loading: boolean;
    data: any; // Contains hourly_usage array [pct, pct...] and hourly_counts
}

export function PerformanceTrends({ loading, data }: PerformanceTrendsProps) {
    if (loading) {
        return (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border p-4">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Saatlik API Kullanımı (Bugün)
                    </h3>
                </div>
                <div className="p-4 h-48 animate-pulse bg-muted/20"></div>
            </div>
        );
    }

    const hourlyUsage = data?.hourly_usage || Array(24).fill(0);
    const hourlyCounts = data?.hourly_counts || Array(24).fill(0);

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-primary/5 border-b border-border p-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Saatlik API Kullanımı (Bugün)
                </h3>
            </div>
            <div className="p-4">
                <div className="flex items-end justify-between h-32 gap-1 mb-2">
                    {hourlyUsage.map((pct: number, i: number) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                            {/* Bar */}
                            <div
                                className={cn(
                                    "w-full rounded-t transition-all duration-500 min-h-[4px]",
                                    pct > 0 ? "bg-primary/80 hover:bg-primary" : "bg-muted/30"
                                )}
                                style={{ height: `${pct}%` }}
                            ></div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-md border border-border whitespace-nowrap">
                                    {i}:00 - {hourlyCounts[i]} çağrı
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* X Axis Labels (Every 3 hours) */}
                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                    <span>00:00</span>
                    <span>03:00</span>
                    <span>06:00</span>
                    <span>09:00</span>
                    <span>12:00</span>
                    <span>15:00</span>
                    <span>18:00</span>
                    <span>21:00</span>
                </div>
            </div>
        </div>
    );
}
