import { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, Plus as PlusIcon } from 'lucide-react';
import { JobsHeader } from '@/components/jobs/JobsHeader';
import { JobCard } from '@/components/jobs/JobCard';
import { JobListRow } from '@/components/jobs/JobListRow';
import { CreateJobModal } from '@/components/jobs/CreateJobModal';
import { JobDetailsModal } from '@/components/jobs/JobDetailsModal';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { useJobsStore } from '@/store';
import { Job } from '@/types';

export function JobsPage() {
    // Use centralized store
    const {
        jobs,
        loading,
        selectedJob,
        fetchJobs,
        addJob,
        updateJob,
        deleteJob,
        setSelectedJob
    } = useJobsStore();

    // Local UI state
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        minApplicants: '',
        maxApplicants: '',
        status: '',
        startDate: '',
        endDate: ''
    });
    const [sortConfig, setSortConfig] = useState<{ key: keyof Job | null; direction: 'asc' | 'desc' }>({
        key: 'createdAt',
        direction: 'desc'
    });
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [viewingJob, setViewingJob] = useState<Job | null>(null);
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

    // Fetch jobs on mount
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleCreateJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'status'>) => {
        await addJob(jobData);
    };

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
        setIsCreateModalOpen(true);
    };

    const handleViewJob = (job: Job) => {
        setViewingJob(job);
    };

    const handleUpdateJob = async (updatedJob: Job) => {
        await updateJob(updatedJob);
    };

    const handleDeleteJob = (jobId: string) => {
        setDeletingJobId(jobId);
    };

    const confirmDeleteJob = async () => {
        if (deletingJobId) {
            await deleteJob(deletingJobId);
            setDeletingJobId(null);

            // If we are deleting the job currently being edited/viewed, close those modals
            if (editingJob?.id === deletingJobId) {
                setIsCreateModalOpen(false);
                setEditingJob(null);
            }
            if (viewingJob?.id === deletingJobId) {
                setViewingJob(null);
            }
        }
    };

    const handleSort = (key: keyof Job) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            title: '',
            location: '',
            minApplicants: '',
            maxApplicants: '',
            status: '',
            startDate: '',
            endDate: ''
        });
    };

    // Memoized filtered jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            // Global Search
            const matchesSearch =
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Specific Filters
            if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
            if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
            if (filters.status && job.status !== filters.status) return false;

            const applicants = job.applicantsCount;
            if (filters.minApplicants && applicants < parseInt(filters.minApplicants)) return false;
            if (filters.maxApplicants && applicants > parseInt(filters.maxApplicants)) return false;

            const jobDate = new Date(job.createdAt);
            if (filters.startDate && jobDate < new Date(filters.startDate)) return false;
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                if (jobDate > endDate) return false;
            }

            return true;
        });
    }, [jobs, searchQuery, filters]);

    // Memoized sorted jobs
    const sortedJobs = useMemo(() => {
        return [...filteredJobs].sort((a, b) => {
            if (!sortConfig.key) return 0;

            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === undefined || bValue === undefined) return 0;
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredJobs, sortConfig]);

    if (loading) {
        return (
            <div className="flex-1 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-72 bg-muted/20 animate-pulse rounded-xl border border-border/50"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto h-full animate-in">
            <div className="space-y-6">
                <JobsHeader
                    viewMode={viewMode}
                    onViewChange={setViewMode}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    onCreateJob={() => {
                        setEditingJob(null);
                        setIsCreateModalOpen(true);
                    }}
                />

                <CreateJobModal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingJob(null);
                    }}
                    onCreate={handleCreateJob}
                    initialData={editingJob}
                    onUpdate={handleUpdateJob}
                    onDelete={handleDeleteJob}
                />

                <JobDetailsModal
                    isOpen={!!viewingJob}
                    job={viewingJob}
                    onClose={() => setViewingJob(null)}
                    onEdit={(job) => {
                        setViewingJob(null);
                        handleEditJob(job);
                    }}
                />

                <DeleteConfirmationModal
                    isOpen={!!deletingJobId}
                    onClose={() => setDeletingJobId(null)}
                    onConfirm={confirmDeleteJob}
                    title="Delete Job Post"
                    description="Are you sure you want to delete this job posting? This action cannot be undone and all associated data including applicant records will be permanently removed."
                />

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedJobs.map(job => (
                            <JobCard key={job.id} job={job} onEdit={handleEditJob} onView={handleViewJob} onDelete={handleDeleteJob} />
                        ))}

                        {/* Add New Card Stub - Only in Grid */}
                        <button
                            onClick={() => {
                                setEditingJob(null);
                                setIsCreateModalOpen(true);
                            }}
                            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 h-full min-h-[280px] transition-all p-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PlusIcon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">Create New Job</h3>
                                <p className="text-sm text-muted-foreground mt-1">Start hiring for a new role</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {/* List Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground">
                            <div onClick={() => handleSort('title')} className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                Job Title
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                            </div>
                            <div onClick={() => handleSort('location')} className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                Location
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                            </div>
                            <div onClick={() => handleSort('createdAt')} className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                Posted
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                            </div>
                            <div onClick={() => handleSort('applicantsCount')} className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                Applicants
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                            </div>
                            <div onClick={() => handleSort('status')} className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                Status
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                            </div>
                            <div className="col-span-1 text-right">
                                Actions
                            </div>
                        </div>

                        {sortedJobs.map(job => (
                            <JobListRow key={job.id} job={job} onEdit={handleEditJob} onView={handleViewJob} onDelete={handleDeleteJob} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
