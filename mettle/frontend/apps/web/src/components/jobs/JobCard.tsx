import { MapPin, Building, Edit, ArrowUpRight, Calendar, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists based on DashboardPage
import { Job } from '@/types';

interface JobCardProps {
    job: Job;
    onEdit: (job: Job) => void;
    onView: (job: Job) => void;
    onDelete: (id: string) => void;
}

export function JobCard({ job, onEdit, onView, onDelete }: JobCardProps) {
    const statusColors = {
        Open: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        Draft: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        Closed: 'text-negative bg-negative/10 border-negative/20',
    };

    return (
        <div
            onClick={() => onView(job)}
            className="group bg-card hover:bg-card/50 border border-border/50 hover:border-primary/20 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden cursor-pointer"
        >
            {/* Neon Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full gap-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {job.department}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", statusColors[job.status] || statusColors.Draft)}>
                        {job.status}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/40">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50">
                        <span className="text-xs text-muted-foreground mb-1">Applicants</span>
                        <span className="text-lg font-bold">{job.applicantsCount}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50">
                        <span className="text-xs text-muted-foreground mb-1">Interview</span>
                        <span className="text-lg font-bold">{Math.round(job.applicantsCount * 0.4)}</span> {/* Mock logic */}
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50">
                        <span className="text-xs text-muted-foreground mb-1">Offer</span>
                        <span className="text-lg font-bold">{Math.round(job.applicantsCount * 0.1)}</span> {/* Mock logic */}
                    </div>
                </div>

                {/* Footer/Actions */}
                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                        {/* Mock Avatars */}
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] text-muted-foreground overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.id}-${i}`} alt="candidate" />
                            </div>
                        ))}
                        {job.applicantsCount > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                                +{job.applicantsCount - 3}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(job);
                            }}
                            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(job.id);
                            }}
                            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(job);
                            }}
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-all shrink-0 group-hover:bg-primary group-hover:text-primary-foreground"
                            title="View Details"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
