import { Candidate } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCompactCardProps {
    candidate: Candidate;
    onClick?: (candidate: Candidate) => void;
    jobTitle?: string;
}

export function CandidateCompactCard({ candidate, onClick, jobTitle }: CandidateCompactCardProps) {
    return (
        <div
            onClick={() => onClick?.(candidate)}
            className="group flex items-center gap-3 bg-card border border-border/60 rounded-xl p-3 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
        >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-border/50 shrink-0 bg-muted/20 flex items-center justify-center">
                {candidate.photoUrl ? (
                    <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs font-bold text-muted-foreground">{candidate.name.charAt(0)}</span>
                )}
            </div>

            {/* Info (Name & Role) */}
            <div className="flex flex-col min-w-0 mr-auto">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                    {candidate.name}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5 text-[10px] font-medium leading-tight">
                    <span className="truncate max-w-[100px]" title={candidate.role || 'No Role'}>
                        {candidate.role}
                    </span>
                    {jobTitle && (
                        <>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="text-emerald-600/80 truncate max-w-[100px]" title={`Applied for: ${jobTitle}`}>
                                {jobTitle}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* AI Score Badge */}
            <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full border shrink-0",
                candidate.score >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    candidate.score >= 50 ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-red-50 text-red-600 border-red-200"
            )}>
                <span className="text-[10px] font-bold">{candidate.score}</span>
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>

            {/* Action Button (Always Visible) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.(candidate);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-secondary/50 text-secondary-foreground transition-all shrink-0 ml-1 group-hover:bg-primary group-hover:text-primary-foreground"
                title="View Details"
            >
                <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
