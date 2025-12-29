import { Candidate } from '@/types';
import { BadgeCheck, Linkedin, Github, Globe, MapPin, Briefcase, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
    candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'LinkedIn': return <Linkedin className="w-3 h-3 text-blue-600" />;
            case 'GitHub': return <Github className="w-3 h-3 text-gray-800 dark:text-gray-200" />;
            default: return <Globe className="w-3 h-3 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Screening': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Interview': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Offer': return 'bg-[hsl(105,99%,90%)] text-[hsl(105,99%,30%)] dark:bg-[hsl(105,99%,20%)] dark:text-[hsl(105,99%,70%)]';
            case 'Rejected': return 'bg-[hsl(3,79%,92%)] text-[hsl(3,79%,40%)] dark:bg-[hsl(3,60%,20%)] dark:text-[hsl(3,79%,77%)]';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-card group border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-primary/50 relative overflow-hidden">
            {/* AI Score Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/10 text-primary-foreground px-2 py-1 rounded-full text-xs font-bold shadow-sm z-10 border border-primary/20">
                <span className="text-primary-700 dark:text-primary-foreground text-sm">{candidate.score}</span>
                <span className="text-[10px] uppercase opacity-70 text-foreground">AI Score</span>
            </div>

            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors flex-shrink-0">
                    <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate flex items-center gap-1">
                        {candidate.name}
                        {candidate.score > 80 && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="truncate">{candidate.role}</span>
                    </div>
                    {candidate.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <MapPin className="w-3 h-3" />
                            <span>{candidate.location}</span>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-md font-medium border border-border/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="bg-muted p-1 rounded-full">{getSourceIcon(candidate.source)}</span>
                    <span className="text-muted-foreground font-medium">{candidate.source}</span>
                </div>
                <span className={cn("px-2 py-1 rounded-md font-semibold", getStatusColor(candidate.status))}>
                    {candidate.status}
                </span>
            </div>

            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-2 rounded-lg hover:brightness-110 transition-all">
                    Profili İncele
                </button>
                <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground">
                    <Mail className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
