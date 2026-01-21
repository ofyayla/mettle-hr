import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCandidatesStore, useJobsStore } from '@/store';
import {
    Calendar, ArrowUpRight, Briefcase, Users, UserCheck, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardRow } from '@/components/dashboard/DashboardRow';
import { RecruitmentFunnelChart } from '@/components/dashboard/RecruitmentFunnelChart';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecruitmentStatusCard } from '@/components/dashboard/RecruitmentStatusCard';

const scheduleItems = [
    {
        id: 1,
        startTime: '09:30',
        endTime: '10:00',
        title: 'Interview with Habibur Rahman',
        description: 'Product Design • 1st Round',
        date: 'Ağu 19, 2025',
        attendees: [
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Habib',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        ]
    },
    {
        id: 2,
        startTime: '11:00',
        endTime: '11:45',
        title: 'Design Task Review & QA',
        description: 'Team Sync • Weekly',
        date: 'Ağu 19, 2025',
        attendees: [
            'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
        ]
    },
    {
        id: 3,
        startTime: '12:30',
        endTime: '13:00',
        title: 'Design Task Review',
        description: 'Final Polish • Marketing',
        date: 'Ağu 19, 2025',
        attendees: [
            'https://api.dicebear.com/7.x/avataaars/svg?seed=Paul'
        ]
    },
];

const weekDays = [
    { day: 'M', date: 16 },
    { day: 'T', date: 17 },
    { day: 'W', date: 18 },
    { day: 'T', date: 19, active: true },
    { day: 'F', date: 20 },
    { day: 'S', date: 21 },
];

type ChangeType = 'positive' | 'negative' | 'neutral';

export function DashboardPage() {
    const navigate = useNavigate();

    // Use centralized stores instead of local state
    const { candidates, fetchCandidates } = useCandidatesStore();
    const { jobs, fetchJobs } = useJobsStore();

    useEffect(() => {
        fetchCandidates();
        fetchJobs();
    }, [fetchCandidates, fetchJobs]);

    // Calculate dynamic stats from stores
    const totalCandidates = candidates.length;
    const activeJobs = jobs.filter(j => j.status === 'Open').length;
    const interviewedCount = candidates.filter(c => c.status === 'Interview').length;
    const screenedCount = candidates.filter(c => c.status === 'Screening').length;

    const kpiData: Array<{
        title: string;
        value: string;
        icon: typeof Briefcase;
        change: number;
        changeType: ChangeType;
        period: string;
    }> = [
            {
                title: 'Active Jobs',
                value: activeJobs.toString(),
                icon: Briefcase,
                change: 12,
                changeType: 'positive',
                period: 'vs last week'
            },
            {
                title: 'Candidates in Pipeline',
                value: totalCandidates.toString(),
                icon: Users,
                change: 8,
                changeType: 'negative',
                period: 'vs last week'
            },
            {
                title: 'Interviewed this week',
                value: interviewedCount.toString(),
                icon: UserCheck,
                change: 0,
                changeType: 'neutral',
                period: 'vs last week'
            },
        ];

    return (
        <div className="flex h-full animate-in overflow-hidden">
            <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold">Merhaba! 👋</h1>
                        <p className="text-sm text-muted-foreground">Bugün işe alım sürecini kolaylaştıralım</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-96 flex-shrink-0 flex flex-col gap-4">
                        <AIInsightCard />

                        <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-3 hover-neon-border h-[564px] flex flex-col group">
                            <div className="flex items-center justify-between flex-shrink-0">
                                <h3 className="font-semibold text-sm">Ajanda</h3>
                                <button
                                    onClick={() => navigate('/planner')}
                                    className="p-1.5 rounded-lg bg-primary/10 dark:bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 cursor-pointer"
                                >
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex justify-between flex-shrink-0">
                                {weekDays.map((d, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex flex-col items-center gap-1 w-9 py-1.5 rounded-lg cursor-pointer transition-colors",
                                            d.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                        )}
                                    >
                                        <span className="text-[10px] font-medium opacity-60">{d.day}</span>
                                        <span className="text-sm font-bold">{d.date}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                {scheduleItems.map((item) => (
                                    <div key={item.id} className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 space-y-3 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                                        <div className="flex items-center gap-2 text-emerald-700 dark:text-primary">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs font-semibold">{item.startTime} - {item.endTime}</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm mb-0.5">{item.title}</div>
                                            <div className="text-xs text-muted-foreground">{item.description}</div>
                                        </div>
                                        <div className="h-px bg-border/50 w-full" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground font-medium">{item.date}</span>
                                            <div className="flex -space-x-2">
                                                {item.attendees.map((avatar, idx) => (
                                                    <img key={idx} src={avatar} alt="Attendee" className="w-6 h-6 rounded-full border-2 border-background ring-1 ring-background" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex gap-4">
                            {kpiData.map((kpi, index) => {
                                const Icon = kpi.icon;
                                const isClickable = kpi.title === 'Active Jobs';

                                return (
                                    <div
                                        key={index}
                                        onClick={() => isClickable && navigate('/jobs')}
                                        className={cn(
                                            "flex-1 bg-card rounded-2xl p-6 border border-border/50 hover-neon-border group",
                                            isClickable && "cursor-pointer hover:bg-card/80 transition-colors"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-sm font-semibold">{kpi.title}</h3>
                                            {kpi.title === 'Active Jobs' ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate('/jobs'); }}
                                                    className="p-1.5 rounded-lg bg-primary/10 dark:bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                                                >
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-muted">
                                                    <Icon className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="font-bold leading-none" style={{ fontSize: '3rem' }}>{kpi.value}</div>
                                            <div className="flex flex-col">
                                                <div className={cn(
                                                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md w-fit",
                                                    kpi.changeType === 'positive' ? "text-positive bg-positive/10" :
                                                        kpi.changeType === 'negative' ? "text-negative bg-negative/10" :
                                                            "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10"
                                                )}>
                                                    {kpi.changeType === 'positive' && <TrendingUp className="w-4 h-4" />}
                                                    {kpi.changeType === 'negative' && <TrendingDown className="w-4 h-4" />}
                                                    {kpi.changeType === 'neutral' && <Minus className="w-4 h-4" />}
                                                    <span>{Math.abs(kpi.change)}%</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{kpi.period}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <RecruitmentFunnelChart />
                        <DashboardRow className="h-[400px]">
                            <div className="w-[400px] h-full min-h-0">
                                <RecruitmentStatusCard
                                    stats={[
                                        { label: 'Screened', value: screenedCount, trend: { value: '3%', label: 'vs last week', isPositive: true } },
                                        { label: 'Interviewed', value: interviewedCount }
                                    ]}
                                    segments={[
                                        { label: 'Screened', value: screenedCount, color: 'bg-primary', width: '64%' },
                                        { label: 'Interviewed', value: interviewedCount, color: 'bg-[#0BDAB8]', width: '36%' }
                                    ]}
                                    insight={{ text: 'Recruitment efficiency has improved by', highlight: '+12% compared to last month.' }}
                                />
                            </div>
                            <div className="flex-1 h-full min-h-0">
                                <RecentActivity />
                            </div>
                        </DashboardRow>
                    </div>
                </div>
            </div>
        </div>
    );
}
