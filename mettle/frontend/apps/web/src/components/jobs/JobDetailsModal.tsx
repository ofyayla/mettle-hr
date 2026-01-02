import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, Building, Users, Briefcase, Clock, Edit, Sparkles, Search, Filter } from 'lucide-react';
import { Job, Candidate } from '@/types';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';


interface JobDetailsModalProps {
    job: Job | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (job: Job) => void;
}

export function JobDetailsModal({ job, isOpen, onClose, onEdit }: JobDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'candidates'>('details');
    const [candidateSearch, setCandidateSearch] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [candidateFilters, setCandidateFilters] = useState({
        status: '',
        source: '',
        minScore: '',
    });

    // Close filters when clicking outside (simple version)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isFilterOpen && !target.closest('.candidate-filter-container')) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterOpen]);

    const mockCandidates: Candidate[] = [
        {
            id: 'c1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Senior Frontend Developer',
            status: 'New',
            source: 'LinkedIn',
            score: 85,
            tags: ['React', 'TypeScript', 'Node.js'],
            createdAt: '2023-10-25',
            skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
            experienceYears: 5
        },
        {
            id: 'c2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            role: 'Full Stack Engineer',
            status: 'Interview',
            source: 'Referral',
            score: 92,
            tags: ['Python', 'Django', 'React'],
            createdAt: '2023-10-26',
            skills: ['Python', 'Django', 'React', 'PostgreSQL'],
            experienceYears: 7
        },
        {
            id: 'c3',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Frontend Developer',
            status: 'Rejected',
            source: 'Indeed',
            score: 65,
            tags: ['HTML', 'CSS', 'JavaScript'],
            createdAt: '2023-10-27',
            skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
            experienceYears: 2
        }
    ];
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const filteredCandidates = mockCandidates.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
            c.role.toLowerCase().includes(candidateSearch.toLowerCase()) ||
            c.skills.some(skill => skill.toLowerCase().includes(candidateSearch.toLowerCase()));

        if (!matchesSearch) return false;

        if (candidateFilters.status && c.status !== candidateFilters.status) return false;
        if (candidateFilters.source && c.source !== candidateFilters.source) return false;
        if (candidateFilters.minScore && c.score < parseInt(candidateFilters.minScore)) return false;

        return true;
    });

    if (!isOpen || !job) return null;

    const statusColors = {
        Open: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        Draft: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        Closed: 'text-negative bg-negative/10 border-negative/20',
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-card w-full max-w-4xl h-[85vh] max-h-[800px] rounded-3xl border border-border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border/50 bg-muted/20">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                {job.title}
                            </h2>
                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColors[job.status])}>
                                {job.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Building className="w-4 h-4 text-primary" />
                                {job.department}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-primary" />
                                {job.location}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-primary" />
                                Created {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full divide-y md:divide-y-0 md:divide-x divide-border/50">
                        {/* Left Column: Metadata & Applicants */}
                        <div className="col-span-1 p-6 space-y-8 bg-muted/5">
                            {/* Quick Stats */}
                            <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-muted-foreground">Applicants</h3>
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-3xl font-bold text-foreground">{job.applicantsCount}</div>
                                        <div className="text-xs text-muted-foreground">Total applications</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                                        <div>
                                            <div className="text-lg font-semibold text-foreground/80">{Math.round(job.applicantsCount * 0.4)}</div>
                                            <div className="text-[10px] text-muted-foreground">Interview</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-emerald-500">{Math.round(job.applicantsCount * 0.1)}</div>
                                            <div className="text-[10px] text-muted-foreground">Offer</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Block */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">Job Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Employment Type</span>
                                            <span className="font-medium">{job.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Posted</span>
                                            <span className="font-medium">{new Date(job.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Content (Tabs) */}
                        <div className="col-span-2 flex flex-col h-full overflow-hidden">
                            {/* Tabs Header */}
                            <div className="flex items-center gap-6 px-8 border-b border-border/50 sticky top-0 bg-card z-10 pt-6">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={cn(
                                        "pb-4 text-sm font-medium border-b-2 transition-colors",
                                        activeTab === 'details'
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('candidates')}
                                    className={cn(
                                        "pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                                        activeTab === 'candidates'
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Candidates
                                    <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                                        {mockCandidates.length}
                                    </span>
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                {activeTab === 'details' ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                <span className="w-1.5 h-6 rounded-full bg-primary" />
                                                About the Role
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {job.description || "No description provided."}
                                            </p>
                                        </div>

                                        {job.requirements && job.requirements.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <span className="w-1.5 h-6 rounded-full bg-secondary-teal" />
                                                    Requirements
                                                </h3>
                                                <ul className="grid gap-3">
                                                    {job.requirements.map((req, i) => (
                                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 flex-shrink-0" />
                                                            <span className="leading-relaxed">{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="flex gap-2 mb-4 candidate-filter-container relative">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    placeholder="Search candidates by name, role, or skills..."
                                                    value={candidateSearch}
                                                    onChange={(e) => setCandidateSearch(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl border border-border/50 flex items-center gap-2 text-sm font-medium transition-colors",
                                                    isFilterOpen || Object.values(candidateFilters).some(v => v)
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : "bg-card hover:bg-muted text-muted-foreground"
                                                )}
                                            >
                                                <Filter className="w-4 h-4" />
                                                Filters
                                                {Object.values(candidateFilters).some(v => v) && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                )}
                                            </button>

                                            {/* Filter Panel */}
                                            {isFilterOpen && (
                                                <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-semibold text-sm">Filters</h4>
                                                        <button
                                                            onClick={() => setCandidateFilters({ status: '', source: '', minScore: '' })}
                                                            className="text-xs text-muted-foreground hover:text-primary"
                                                        >
                                                            Clear All
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                                                            <select
                                                                value={candidateFilters.status}
                                                                onChange={(e) => setCandidateFilters(prev => ({ ...prev, status: e.target.value }))}
                                                                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none cursor-pointer"
                                                            >
                                                                <option value="">All Statuses</option>
                                                                <option value="New">New</option>
                                                                <option value="Interview">Interview</option>
                                                                <option value="Offer">Offer</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-medium text-muted-foreground">Source</label>
                                                            <select
                                                                value={candidateFilters.source}
                                                                onChange={(e) => setCandidateFilters(prev => ({ ...prev, source: e.target.value }))}
                                                                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none cursor-pointer"
                                                            >
                                                                <option value="">All Sources</option>
                                                                <option value="LinkedIn">LinkedIn</option>
                                                                <option value="GitHub">GitHub</option>
                                                                <option value="Referral">Referral</option>
                                                                <option value="Indeed">Indeed</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-medium text-muted-foreground">Min AI Score</label>
                                                            <input
                                                                type="number"
                                                                value={candidateFilters.minScore}
                                                                onChange={(e) => setCandidateFilters(prev => ({ ...prev, minScore: e.target.value }))}
                                                                placeholder="e.g. 80"
                                                                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none"
                                                                min="0"
                                                                max="100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {filteredCandidates.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No candidates found matching "{candidateSearch}"
                                            </div>
                                        ) : (
                                            filteredCandidates.map((candidate) => (
                                                <div
                                                    key={candidate.id}
                                                    className="group p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all flex items-start justify-between"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-medium text-muted-foreground">
                                                            {candidate.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                                {candidate.name}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">{candidate.role}</p>

                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {candidate.skills.slice(0, 3).map(skill => (
                                                                    <span key={skill} className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className={cn(
                                                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                            candidate.status === 'New' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                            candidate.status === 'Interview' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                                                            candidate.status === 'Rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
                                                            candidate.status === 'Offer' && "bg-green-500/10 text-green-500 border-green-500/20",
                                                        )}>
                                                            {candidate.status}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                                                            <Sparkles className="w-3 h-3" />
                                                            {candidate.score}% Match
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div >

                {/* Footer */}
                < div className="p-4 border-t border-border/50 bg-card flex justify-end gap-3" >
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-border/50 hover:bg-muted text-muted-foreground font-medium transition-all"
                    >
                        Close
                    </button>
                    {onEdit && (
                        <button
                            onClick={() => onEdit(job)}
                            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Job
                        </button>
                    )}
                </div >
            </div >
        </div >,
        document.body
    );
}
