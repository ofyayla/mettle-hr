import React from 'react';
import {
    ArrowRight, Calendar, Check, Mail, AlertTriangle, ArrowUpRight,
    MessageSquare, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type ActivityType = 'status_change' | 'interview_scheduled' | 'offer_accepted' | 'email_received' | 'alert';


interface Actor {
    name: string;
    avatar?: string;
    role?: string;
}

interface Target {
    name: string;
    link: string;
}

interface Activity {
    id: number;
    type: ActivityType;
    actor: Actor;
    target?: Target;
    action?: string;
    value?: string;
    snippet?: string;
    timestamp: string;
    isUnread: boolean;
    isMention?: boolean;
    isMyCandidate?: boolean;
}

// Mock Data
const mockActivities: Activity[] = [
    {
        id: 1,
        type: 'status_change',
        actor: { name: 'Selin Demir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selin', role: 'Recruiter' },
        target: { name: 'Mehmet Can', link: '/candidates/123' },
        action: 'moved to',
        value: 'Technical Interview',
        timestamp: '2025-12-28T21:00:00Z',
        isUnread: true,
        isMyCandidate: true
    },
    {
        id: 2,
        type: 'email_received',
        actor: { name: 'Ayşe Yılmaz', role: 'Candidate' },
        snippet: 'Merhaba, mülakat için uygun olduğum günleri paylaşmak istiyorum...',
        timestamp: '2025-12-28T20:45:00Z',
        isUnread: true,
        isMention: true
    },
    {
        id: 3,
        type: 'interview_scheduled',
        actor: { name: 'Ali Kaya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali', role: 'HR Manager' },
        target: { name: 'Zeynep Özkan', link: '/candidates/456' },
        value: 'Yarın 14:00',
        timestamp: '2025-12-28T18:30:00Z',
        isUnread: false,
        isMyCandidate: true
    },
    {
        id: 4,
        type: 'offer_accepted',
        actor: { name: 'Burak Yıldız', role: 'Candidate' },
        target: { name: 'Frontend Developer', link: '/jobs/789' },
        timestamp: '2025-12-27T16:00:00Z',
        isUnread: false
    },
    {
        id: 5,
        type: 'alert',
        actor: { name: 'Sistem', role: 'System' },
        target: { name: 'Deniz Acar', link: '/candidates/321' },
        action: 'mülakata gelmedi',
        timestamp: '2025-12-27T10:00:00Z',
        isUnread: false,
        isMention: true
    },
    {
        id: 6,
        type: 'status_change',
        actor: { name: 'Elif Şahin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elif', role: 'Recruiter' },
        target: { name: 'Cem Öztürk', link: '/candidates/654' },
        action: 'moved to',
        value: 'Offer Stage',
        timestamp: '2025-12-26T14:00:00Z',
        isUnread: false
    }
];

// Helper Functions
function getRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function getDateGroup(timestamp: string): 'today' | 'yesterday' | 'this_week' | 'older' {
    const now = new Date();
    const date = new Date(timestamp);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (date >= todayStart) return 'today';
    if (date >= yesterdayStart) return 'yesterday';
    if (date >= weekStart) return 'this_week';
    return 'older';
}

function getActivityConfig(type: ActivityType) {
    const configs = {
        status_change: {
            icon: ArrowRight,
            bgColor: 'bg-blue-50 dark:bg-blue-500/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-200 dark:border-blue-500/30'
        },
        interview_scheduled: {
            icon: Calendar,
            bgColor: 'bg-purple-50 dark:bg-purple-500/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-200 dark:border-purple-500/30'
        },
        offer_accepted: {
            icon: Check,
            bgColor: 'bg-green-50 dark:bg-green-500/20',
            textColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-green-200 dark:border-green-500/30'
        },
        email_received: {
            icon: Mail,
            bgColor: 'bg-yellow-50 dark:bg-yellow-500/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            borderColor: 'border-yellow-200 dark:border-yellow-500/30'
        },
        alert: {
            icon: AlertTriangle,
            bgColor: 'bg-red-50 dark:bg-red-500/20',
            textColor: 'text-red-600 dark:text-red-400',
            borderColor: 'border-red-200 dark:border-red-500/30'
        }
    };
    return configs[type];
}

function renderActivityText(activity: Activity): React.ReactNode {
    switch (activity.type) {
        case 'status_change':
            return (
                <>
                    <span className="font-semibold">{activity.actor.name}</span>
                    {' '}{activity.action}{' '}
                    <a href={activity.target?.link} className="font-semibold text-emerald-700 dark:text-primary hover:underline">
                        {activity.target?.name}
                    </a>
                    {' '}to{' '}
                    <span className="bg-blue-100 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">
                        {activity.value}
                    </span>
                </>
            );
        case 'interview_scheduled':
            return (
                <>
                    <span className="font-semibold">{activity.actor.name}</span>
                    {' '}scheduled interview with{' '}
                    <a href={activity.target?.link} className="font-semibold text-emerald-700 dark:text-primary hover:underline">
                        {activity.target?.name}
                    </a>
                    {' '}for{' '}
                    <span className="font-medium text-purple-600 dark:text-purple-400">{activity.value}</span>
                </>
            );
        case 'offer_accepted':
            return (
                <>
                    <span className="font-semibold">{activity.actor.name}</span>
                    {' '}accepted offer for{' '}
                    <a href={activity.target?.link} className="font-semibold text-emerald-700 dark:text-primary hover:underline">
                        {activity.target?.name}
                    </a>
                </>
            );
        case 'email_received':
            return (
                <>
                    New email from{' '}
                    <span className="font-semibold">{activity.actor.name}</span>
                </>
            );
        case 'alert':
            return (
                <>
                    <a href={activity.target?.link} className="font-semibold text-red-600 dark:text-red-400 hover:underline">
                        {activity.target?.name}
                    </a>
                    {' '}{activity.action}
                </>
            );
        default:
            return null;
    }
}



const groupLabels: Record<string, string> = {
    today: 'Bugün',
    yesterday: 'Dün',
    this_week: 'Bu Hafta',
    older: 'Daha Önce'
};

export function RecentActivity() {
    // Group activities by date
    const groupedActivities = mockActivities.reduce((acc, activity) => {
        const group = getDateGroup(activity.timestamp);
        if (!acc[group]) acc[group] = [];
        acc[group].push(activity);
        return acc;
    }, {} as Record<string, Activity[]>);


    const groupOrder = ['today', 'yesterday', 'this_week', 'older'];

    return (
        <div className="bg-card rounded-2xl border border-border/50 hover-neon-border flex flex-col h-full min-h-0 group">
            {/* Header */}
            <div className="p-4 border-b border-border/30 flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-sm">Recent Activity</h3>
                <div className="flex items-center gap-2">
                    <button className="text-xs text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors">
                        View All
                    </button>
                    <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>



            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {groupOrder.map(groupKey => {
                    const activities = groupedActivities[groupKey];
                    if (!activities || activities.length === 0) return null;

                    return (
                        <div key={groupKey}>
                            {/* Group Header */}
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                {groupLabels[groupKey]}
                            </h4>

                            {/* Timeline Container */}
                            <div className="relative">
                                {/* Continuous Timeline Line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50" />

                                {/* Activities */}
                                <div className="space-y-3">
                                    {activities.map(activity => {
                                        const config = getActivityConfig(activity.type);
                                        const Icon = config.icon;

                                        return (
                                            <div
                                                key={activity.id}
                                                className="relative flex items-stretch gap-3"
                                            >
                                                {/* Icon Column - Centered on timeline */}
                                                <div className="relative flex items-center justify-center w-8 flex-shrink-0">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center border-4 border-card z-10",
                                                        config.bgColor
                                                    )}>
                                                        <Icon className={cn("w-3.5 h-3.5", config.textColor)} />
                                                    </div>
                                                </div>

                                                {/* Activity Card */}
                                                <div className={cn(
                                                    "flex-1 min-w-0 p-3 rounded-xl border transition-all cursor-pointer group",
                                                    activity.isUnread
                                                        ? "bg-primary/5 dark:bg-primary/10 border-primary/20 hover:border-primary/40"
                                                        : "bg-muted/30 dark:bg-muted/20 border-border/30 hover:border-border/60 hover:bg-muted/50 dark:hover:bg-muted/30"
                                                )}>

                                                    <p className="text-sm text-foreground leading-relaxed">
                                                        {renderActivityText(activity)}
                                                    </p>

                                                    {/* Snippet */}
                                                    {activity.snippet && (
                                                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 italic">
                                                            "{activity.snippet}"
                                                        </p>
                                                    )}

                                                    {/* Footer: Time + Actions */}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {getRelativeTime(activity.timestamp)}
                                                        </span>

                                                        {/* Quick Actions (show on hover) */}
                                                        <div className="hidden group-hover:flex items-center gap-1">
                                                            {activity.type === 'email_received' && (
                                                                <button className="flex items-center gap-1 text-xs text-emerald-700 dark:text-primary font-medium hover:underline">
                                                                    <MessageSquare className="w-3 h-3" />
                                                                    Reply
                                                                </button>
                                                            )}
                                                            {(activity.type === 'interview_scheduled' || activity.type === 'status_change') && (
                                                                <button className="flex items-center gap-1 text-xs text-emerald-700 dark:text-primary font-medium hover:underline">
                                                                    <Eye className="w-3 h-3" />
                                                                    View
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {mockActivities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No activities found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
