import { MapPin, Building, Edit, ArrowUpRight, Calendar, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Job } from '@/types';

interface JobListRowProps {
    job: Job;
    onEdit: (job: Job) => void;
    onView: (job: Job) => void;
    onDelete: (id: string) => void;
}

export function JobListRow({ job, onEdit, onView, onDelete }: JobListRowProps) {
    const statusColors = {
        Open: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        Draft: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        Closed: 'text-negative bg-negative/10 border-negative/20',
    };

    return (
        <div
            onClick={() => onView(job)}
            className="group grid grid-cols-12 gap-4 items-center bg-card hover:bg-card/50 border border-border/50 hover:border-primary/20 rounded-xl p-4 transition-all duration-300 hover:shadow-sm cursor-pointer"
        >

            {/* Job Title & Dept - Col Span 3 */}
            <div className="col-span-3 min-w-0">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {job.department}
                    </span>
                </div>
            </div>

            {/* Location - Col Span 2 */}
            <div className="col-span-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {job.location}
            </div>

            {/* Date - Col Span 2 */}
            <div className="col-span-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            {/* Applicants - Col Span 2 */}
            <div className="col-span-2">
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Applicants</span>
                        <span className="font-bold text-sm">{job.applicantsCount}</span>
                    </div>
                </div>
            </div>

            {/* Status - Col Span 2 */}
            <div className="col-span-2">
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", statusColors[job.status] || statusColors.Draft)}>
                    {job.status}
                </span>
            </div>


            {/* Actions - Col Span 1 */}
            <div className="col-span-1 flex justify-end gap-2 text-right">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(job);
                    }}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job.id);
                    }}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(job);
                    }}
                    className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                >
                    <Edit className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
