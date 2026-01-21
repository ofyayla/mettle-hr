import { Clock, MessageCircle, FileText, Code, Languages, List, Mic, Zap, LucideIcon } from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import type { ActivityItem } from '@/types/admin';

interface RecentActivitiesProps {
    loading: boolean;
    data: ActivityItem[];
}

const serviceIcons: Record<string, { icon: LucideIcon, color: string, bg: string }> = {
    rag_chat: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    rag_embedding: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    text_to_sql: { icon: Code, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    nl2sql: { icon: Code, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    translation: { icon: Languages, color: 'text-green-500', bg: 'bg-green-500/10' },
    summarization: { icon: List, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    speech_to_text: { icon: Mic, color: 'text-red-500', bg: 'bg-red-500/10' },
    feedback: { icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    default: { icon: Zap, color: 'text-gray-500', bg: 'bg-gray-500/10' }
};

export function RecentActivities({ loading, data }: RecentActivitiesProps) {
    if (loading) {
        return (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border p-4">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Son Aktiviteler
                    </h3>
                </div>
                <div className="p-4 space-y-3 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-muted rounded"></div>
                                <div className="h-3 w-1/2 bg-muted rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col h-full max-h-[500px]">
            <div className="bg-primary/5 border-b border-border p-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Son Aktiviteler
                    </h3>
                    <span className="text-xs text-muted-foreground">Son 24 saat</span>
                </div>
            </div>

            <div className="p-0 overflow-y-auto flex-1">
                <div className="divide-y divide-border">
                    {data.map((activity, index) => {
                        const style = serviceIcons[activity.type] || serviceIcons.default;
                        const Icon = style.icon; // Get icon component

                        // Wait, data might come formatted from backend as per admin.js logic or raw? 
                        // Implementation plan assumed creating AdminPage logic.
                        // Ideally we pass raw data and format here, BUT `admin.js` relies on `api/admin/stats` returning
                        // already formatted "recent_activities" list in some parts (icon names etc).
                        // Let's assume we receive the format from `get_admin_stats` in `app.py`.
                        // `app.py` returns `recent_activities` with `type`, `title`, `description`, `time`, `icon` (string name), `color` (tailwind class).
                        // If so, we should use that or map it.
                        // `app.py` line 414: returns type, title, description, time.
                        // So we can use those directly.

                        return (
                            <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex gap-3">
                                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                        // If backend sends specific color classes, use them, else fallback
                                        // app.py sends "blue", "purple" etc strings not full classes usually, but let's see.
                                        // app.py line 398 sets color = "blue" etc. and code uses it for bg-blue-500/10 logic?
                                        // In React we can use the map above or the backend data.
                                        // Utilizing the map above is safer for full tailwind classes.
                                        style.bg
                                    )}>
                                        <Icon className={cn("w-4 h-4", style.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {activity.title}
                                                {/* activity.title already includes "(başarılı)" etc from backend? 
                                                    app.py line 411: f"{service} işlemi ... (başarılı/başarısız)" 
                                                */}
                                            </p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatTimeAgo(activity.time)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {data.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Henüz aktivite yok.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
