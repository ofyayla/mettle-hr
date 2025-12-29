import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Area, ComposedChart } from 'recharts';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FunnelData {
    stage: string;
    count: number;
    conversion: number;
    dropoff?: number;
}

const funnelData: FunnelData[] = [
    { stage: 'Başvurular', count: 50100, conversion: 100 },
    { stage: 'Kısa Liste', count: 37100, conversion: 74, dropoff: -26 },
    { stage: 'Mülakatlar', count: 29100, conversion: 78, dropoff: -22 },
    { stage: 'Teklifler', count: 9100, conversion: 31, dropoff: -69 },
    { stage: 'İşe Alımlar', count: 6200, conversion: 68, dropoff: -32 },
];

const formatNumber = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: FunnelData }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-popover border border-border rounded-xl p-4 shadow-xl backdrop-blur-sm">
                <p className="font-semibold text-foreground mb-2">{data.stage}</p>
                <p className="text-2xl font-bold text-foreground mb-3">
                    {formatNumber(data.count)}
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-positive" />
                        <span className="text-muted-foreground">Dönüşüm:</span>
                        <span className="font-semibold text-positive">
                            %{data.conversion}
                        </span>
                    </div>
                    {data.dropoff && (
                        <div className="flex items-center gap-2 text-sm">
                            <TrendingDown className="w-4 h-4 text-negative" />
                            <span className="text-muted-foreground">Kayıp:</span>
                            <span className="font-semibold text-negative">
                                %{data.dropoff}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export function RecruitmentFunnelChart() {
    const navigate = useNavigate();

    // Calculate gradient stops based on data
    const maxCount = Math.max(...funnelData.map(d => d.count));

    return (
        <div
            className="bg-card rounded-2xl p-6 border border-border/50 space-y-3 cursor-pointer hover-neon-border group"
            onClick={() => navigate('/pipeline')}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="font-semibold text-sm">Recruitment Progress</h3>
                    <p className="text-xs text-muted-foreground mt-1.5">Son 30 gün</p>
                </div>
                <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-muted group-hover:brightness-110 transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                </div>
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={funnelData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="stage"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            tickFormatter={formatNumber}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            fill="url(#areaGradient)"
                            stroke="none"
                        />
                        <Bar
                            dataKey="count"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                        >
                            {funnelData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill="url(#barGradient)"
                                    opacity={0.5 + (entry.count / maxCount) * 0.5}
                                />
                            ))}
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
