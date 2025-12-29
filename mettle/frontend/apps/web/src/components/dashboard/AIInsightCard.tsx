import { Sparkles, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Candidate {
    id: number;
    name: string;
    role: string;
    score: number;
    avatar: string;
    rank: number;
}

const topCandidates: Candidate[] = [
    {
        id: 1,
        name: 'Elif Yılmaz',
        role: 'Frontend Developer',
        score: 66.2,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elif',
        rank: 1
    },
    {
        id: 2,
        name: 'Ahmet Kaya',
        role: 'Backend Developer',
        score: 62.8,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet',
        rank: 2
    },
    {
        id: 3,
        name: 'Zeynep Demir',
        role: 'Full Stack Developer',
        score: 58.4,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep',
        rank: 3
    }
];

export function AIInsightCard() {
    return (
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4 hover-neon-border">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                    {/* AI Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">AI Insights</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                        Top 3 candidates for this position based on skills and communication speed
                    </h3>
                </div>

                {/* Arrow Icon */}
                <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-muted flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                </div>
            </div>

            {/* Candidate List */}
            <div className="space-y-3">
                {topCandidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-full",
                            "bg-muted/50 dark:bg-muted/30",
                            "hover:bg-muted dark:hover:bg-muted/50",
                            "cursor-pointer transition-all duration-200",
                            "group"
                        )}
                        title={`İletişim hızı ve yetenek uyumu baz alınmıştır. Skor: %${candidate.score}`}
                    >
                        {/* Left: Avatar & Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={candidate.avatar}
                                alt={candidate.name}
                                className="w-10 h-10 rounded-full bg-muted border-2 border-background"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {candidate.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {candidate.role}
                                </span>
                            </div>
                        </div>

                        {/* Right: Score & Rank */}
                        <div className="flex items-center gap-3">
                            {/* Score */}
                            <span className="text-base font-bold text-foreground">
                                %{candidate.score}
                            </span>

                            {/* Rank Badge */}
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                "bg-muted dark:bg-background/50 text-muted-foreground"
                            )}>
                                {candidate.rank}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
