import { Candidate } from '@/types';
import { BadgeCheck, Linkedin, Github, Globe, MapPin, Briefcase, Mail, Star, Trash2, ArrowUpRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CANDIDATE_STATUS_STYLES } from '@/constants/candidate';

interface CandidateCardProps {
    candidate: Candidate;
    onClick?: (candidate: Candidate) => void;
    onDelete?: (candidate: Candidate) => void;
    jobTitle?: string;
}

export function CandidateCard({ candidate, onClick, onDelete, jobTitle }: CandidateCardProps) {
    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'LinkedIn': return <Linkedin className="w-3 h-3 text-blue-600" />;
            case 'GitHub': return <Github className="w-3 h-3 text-gray-800 dark:text-gray-200" />;
            default: return <Globe className="w-3 h-3 text-gray-500" />;
        }
    };

    return (
        <div
            onClick={() => onClick?.(candidate)}
            className="group bg-card border border-border/60 rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative cursor-pointer flex flex-col h-full"
        >
            {/* Top Row: Avatar & Score */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border/50 group-hover:border-primary/20 transition-colors shadow-sm flex items-center justify-center bg-muted/20">
                    {candidate.photoUrl ? (
                        <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-bold text-muted-foreground">{candidate.name.charAt(0)}</span>
                    )}
                </div>

                {/* Header Actions: Job Badge & AI Score */}
                <div className="flex items-center gap-2">
                    {jobTitle && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/40 border border-border/50 text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
                            <Target className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{jobTitle}</span>
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                        candidate.score >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" :
                            candidate.score >= 50 ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800" :
                                "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    )}>
                        <Star className="w-3 h-3 fill-current" />
                        <span>{candidate.score}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                    {candidate.name}
                    {candidate.score > 85 && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />}
                </h3>

                <div className="flex items-center gap-2 text-sm text-foreground/80 mb-2 font-medium">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span>{candidate.role}</span>
                </div>

                {candidate.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{candidate.location}</span>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {candidate.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-[10px] rounded-md font-medium border border-border/40">
                            {tag}
                        </span>
                    ))}
                    {candidate.tags.length > 3 && (
                        <span className="px-2 py-1 text-[10px] text-muted-foreground font-medium">
                            +{candidate.tags.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Footer Information & Actions */}
            <div className="pt-4 mt-auto border-t border-border/40 flex items-center justify-between text-xs gap-3">
                {/* Left: Source & Status */}
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-1.5 text-muted-foreground min-w-0 flex-shrink">
                        {getSourceIcon(candidate.source)}
                        <span className="truncate">{candidate.source}</span>
                    </div>
                    <div className={cn("px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide flex-shrink-0 whitespace-nowrap", CANDIDATE_STATUS_STYLES[candidate.status] || "bg-muted text-muted-foreground")}>
                        {candidate.status}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-1 flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${candidate.email}`;
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Send Email"
                    >
                        <Mail className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(candidate);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete Candidate"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.(candidate);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-all shrink-0 group-hover:bg-primary group-hover:text-primary-foreground"
                        title="View Profile"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
