import { X, Search } from 'lucide-react';

import { Job } from '@/types';

interface Filters {
    status: string;
    source: string;
    minScore: string;
    location: string;
    minExperience: string;
    jobId?: string;
}

interface CandidatesFilterPanelProps {
    filters: Filters;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onClearFilters: () => void;
    onClose: () => void;
    jobs?: Job[];
}

export function CandidatesFilterPanel({ filters, onFilterChange, onClearFilters, onClose, jobs }: CandidatesFilterPanelProps) {
    const statuses = ['New', 'Screening', 'Interview', 'Offer', 'Rejected'];
    const sources = ['LinkedIn', 'GitHub', 'Referral', 'CareerPage', 'Indeed'];

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Filters</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Job Filter */}
                {jobs && jobs.length > 0 && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Job</label>
                        <select
                            value={filters.jobId || 'all'}
                            onChange={(e) => onFilterChange('jobId', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">All Jobs</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Status Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Source Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Source</label>
                    <select
                        value={filters.source}
                        onChange={(e) => onFilterChange('source', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                    >
                        <option value="">All Sources</option>
                        {sources.map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                </div>

                {/* Location Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => onFilterChange('location', e.target.value)}
                        placeholder="e.g. New York, Remote"
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                    />
                </div>

                {/* Min AI Score Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Min AI Score</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.minScore}
                        onChange={(e) => onFilterChange('minScore', e.target.value)}
                        placeholder="e.g. 80"
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                    />
                </div>

                {/* Experience Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Min Experience (Years)</label>
                    <input
                        type="number"
                        min="0"
                        value={filters.minExperience}
                        onChange={(e) => onFilterChange('minExperience', e.target.value)}
                        placeholder="e.g. 3"
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
