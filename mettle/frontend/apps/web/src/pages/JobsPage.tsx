import { useState } from 'react';
import { ArrowUpDown, Plus as PlusIcon } from 'lucide-react';
import { JobsHeader } from '@/components/jobs/JobsHeader';
import { JobCard } from '@/components/jobs/JobCard';
import { JobListRow } from '@/components/jobs/JobListRow';
import { CreateJobModal } from '@/components/jobs/CreateJobModal';
import { JobDetailsModal } from '@/components/jobs/JobDetailsModal';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { Job } from '@/types';

// Mock Data
const mockJobs: Job[] = [
    {
        id: '1',
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        status: 'Open',
        applicantsCount: 45,
        createdAt: '2023-10-01',
        description: "We are looking for an experienced Senior Frontend Engineer to join our core product team. You will be responsible for building high-performance, responsive web applications using React, TypeScript, and modern styling solutions.\n\nThe ideal candidate has a deep understanding of web fundamentals, cares about user experience, and enjoys mentoring junior developers.",
        requirements: [
            "5+ years of experience with React and TypeScript",
            "Deep understanding of browser implementation details",
            "Experience with state management (Redux, Zustand, or Context)",
            "Strong knowledge of modern CSS (Tailwind, CSS-in-JS)",
            "Experience with testing frameworks (Jest, React Testing Library)"
        ]
    },
    {
        id: '2',
        title: 'Product Designer',
        department: 'Product',
        location: 'New York, NY',
        type: 'Full-time',
        status: 'Open',
        applicantsCount: 28,
        createdAt: '2023-10-05',
        description: "Join our design team to shape the future of our product. We need a Product Designer who can bridge the gap between user needs and business goals, creating intuitive and beautiful interfaces.",
        requirements: [
            "3+ years of product design experience",
            "Proficiency in Figma and prototyping tools",
            "Strong portfolio demonstrating UX/UI skills",
            "Experience working in an agile environment",
            "Excellent communication skills"
        ]
    },
    {
        id: '3',
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'London, UK',
        type: 'Full-time',
        status: 'Draft',
        applicantsCount: 0,
        createdAt: '2023-10-10',
        description: "We're seeking a Marketing Manager to lead our growth initiatives. You'll be responsible for developing and executing marketing strategies to increase brand awareness and drive user acquisition.",
        requirements: [
            "4+ years of experience in digital marketing",
            "Proven track record of successful campaigns",
            "Experience with SEO, content marketing, and different channels",
            "Strong analytical skills"
        ]
    },
    {
        id: '4',
        title: 'Backend Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Contract',
        status: 'Closed',
        applicantsCount: 156,
        createdAt: '2023-09-15',
        description: "Help us scale our backend infrastructure. We are looking for a Backend Developer with experience in Node.js and distributed systems.",
        requirements: [
            "Strong proficiency in Node.js and TypeScript",
            "Experience with microservices architecture",
            "Knowledge of PostgreSQL and Redis",
            "Experience with cloud platforms (AWS/GCP)"
        ]
    },
    {
        id: '5',
        title: 'HR Specialist',
        department: 'HR',
        location: 'Berlin, DE',
        type: 'Full-time',
        status: 'Open',
        applicantsCount: 12,
        createdAt: '2023-10-12',
        description: "We are looking for an HR Specialist to support our growing team. You will handle various HR functions including recruitment, onboarding, and employee relations.",
        requirements: [
            "2+ years of experience in HR",
            "Knowledge of employment laws and regulations",
            "Excellent interpersonal and organizational skills",
            "Experience with HRIS software"
        ]
    }
];

export function JobsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // In a real app, this would be state coming from a backend or global store
    const [jobs, setJobs] = useState<Job[]>(mockJobs);

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

    const handleCreateJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'status'>) => {
        const newJob: Job = {
            id: Math.random().toString(36).substr(2, 9),
            ...jobData,
            // Cast to specific string literals or ensure form provides them correctly
            department: jobData.department as any,
            type: jobData.type as any,
            status: 'Open',
            applicantsCount: 0,
            createdAt: new Date().toISOString()
        };
        setJobs([newJob, ...jobs]);
    };

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
        setIsCreateModalOpen(true);
    };

    const handleViewJob = (job: Job) => {
        setViewingJob(job);
    };

    const handleUpdateJob = (updatedJob: Job) => {
        setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
    };

    const handleDeleteJob = (jobId: string) => {
        setDeletingJobId(jobId);
    };

    const confirmDeleteJob = () => {
        if (deletingJobId) {
            setJobs(jobs.filter(j => j.id !== deletingJobId));
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

    // ... (sort and filter logic remains same)

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

    // ... (rest of filtering logic)

    const filteredJobs = jobs.filter(job => {
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
            endDate.setHours(23, 59, 59, 999); // Include the entire end date
            if (jobDate > endDate) return false;
        }

        return true;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0; // Guard against undefined
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

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
                        setEditingJob(null); // Reset editing job on close
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


