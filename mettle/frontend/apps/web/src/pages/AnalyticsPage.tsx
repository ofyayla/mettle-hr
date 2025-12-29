import { BarChart3, Users, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils'; // Keeping it this time as I might use it for conditional coloring

export function AnalyticsPage() {
    return (
        <div className="flex flex-col h-full overflow-hidden p-6 gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Analitik ve Raporlama
                </h2>
                <p className="text-sm text-muted-foreground">
                    İşe alım hunisi ve ekip performans analizleri.
                </p>
            </div>

            <div className="overflow-y-auto pb-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Toplam Başvuru" value="1,248" change="+12%" icon={Users} />
                    <KPICard title="Ort. İşe Alım Süresi" value="18 Gün" change="-2 Gün" icon={Clock} />
                    <KPICard title="Teklif Kabul Oranı" value="%85" change="+5%" icon={Award} />
                    <KPICard title="Aktif Pozisyonlar" value="12" change="0" icon={Briefcase} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Funnel Chart Mock */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold mb-6">İşe Alım Hunisi</h3>
                        <div className="space-y-4">
                            <FunnelLevel label="Başvuru" count={1248} percent={100} color="bg-blue-500" />
                            <FunnelLevel label="Değerlendirme" count={450} percent={36} color="bg-yellow-500" />
                            <FunnelLevel label="Mülakat" count={120} percent={9.6} color="bg-purple-500" />
                            <FunnelLevel label="Teklif" count={45} percent={3.6} color="bg-green-500" />
                            <FunnelLevel label="İşe Alım" count={38} percent={3.0} color="bg-primary" />
                        </div>
                    </div>

                    {/* Sources Chart Mock */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold mb-6">Aday Kaynakları</h3>
                        <div className="flex items-end justify-between h-64 gap-2 px-2">
                            <Bar label="LinkedIn" height="80%" color="bg-blue-600" count={650} />
                            <Bar label="Kariyer.net" height="45%" color="bg-purple-600" count={320} />
                            <Bar label="Referral" height="30%" color="bg-green-500" count={180} />
                            <Bar label="Web Sitesi" height="20%" color="bg-gray-500" count={98} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { LucideIcon, Briefcase } from 'lucide-react';

function KPICard({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: LucideIcon }) {
    const isPositive = change.startsWith('+');
    const isNeutral = change === '0';

    return (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{value}</span>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                    isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        isNeutral ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" :
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                    {change}
                </span>
            </div>
        </div>
    );
}

function FunnelLevel({ label, count, percent, color }: { label: string, count: number, percent: number, color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{count} ({percent}%)</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

function Bar({ label, height, color, count }: { label: string, height: string, color: string, count: number }) {
    return (
        <div className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-full bg-muted/30 rounded-t-lg relative group-hover:bg-muted/50 transition-colors" style={{ height: '100%' }}>
                <div className={cn("absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000 w-full mx-auto", color)} style={{ height }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow transition-opacity">
                        {count}
                    </div>
                </div>
            </div>
            <span className="text-xs font-medium truncate w-full text-center">{label}</span>
        </div>
    );
}
