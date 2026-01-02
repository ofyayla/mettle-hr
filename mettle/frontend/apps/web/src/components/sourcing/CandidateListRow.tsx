import { ArrowUpRight, Briefcase, Star, Mail, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Candidate } from '@/types';
import { format } from 'date-fns';
import { CANDIDATE_STATUS_STYLES } from '@/constants/candidate';

interface CandidateListRowProps {
    candidate: Candidate;
    jobTitle?: string;
    onClick?: (candidate: Candidate) => void;
    onDelete?: (candidate: Candidate) => void;
}

export function CandidateListRow({ candidate, jobTitle, onClick, onDelete }: CandidateListRowProps) {

    return (
        <div
            onClick={() => onClick?.(candidate)}
            className="group grid grid-cols-12 gap-4 items-center bg-card hover:bg-card/50 border border-border/50 hover:border-primary/20 rounded-xl p-4 transition-all duration-300 hover:shadow-sm cursor-pointer"
        >
            {/* Name & Avatar - Col Span 3 */}
            <div className="col-span-3 min-w-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                    {candidate.photoUrl ? (
                        <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                        candidate.name.charAt(0)
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{candidate.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 line-clamp-1">
                            <Briefcase className="w-3 h-3 shrink-0" />
                            {candidate.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Applied Role - Col Span 3 */}
            <div className="col-span-3 flex items-center text-sm font-medium text-foreground">
                <span className="truncate">{jobTitle || '-'}</span>
            </div>

            {/* Applied Date - Col Span 2 */}
            <div className="col-span-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{candidate.createdAt ? format(new Date(candidate.createdAt), 'MMM dd, yyyy') : '-'}</span>
            </div>

            {/* Match Score - Col Span 1 */}
            <div className="col-span-1 flex items-center gap-1.5">
                <div className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    {candidate.score}%
                </div>
            </div>

            {/* Status - Col Span 2 */}
            <div className="col-span-2">
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap", CANDIDATE_STATUS_STYLES[candidate.status] || "bg-muted text-muted-foreground")}>
                    {candidate.status}
                </span>
            </div>

            {/* Actions - Col Span 1 */}
            <div className="col-span-1 flex justify-end gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Mock mail action
                        window.location.href = `mailto:${candidate.email}`;
                    }}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                    title="Send Email"
                >
                    <Mail className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(candidate);
                    }}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-all"
                    title="Delete Candidate"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.(candidate);
                    }}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                    title="View Profile"
                >
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
