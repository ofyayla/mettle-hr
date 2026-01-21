import { useState, useEffect, useMemo, useRef } from 'react';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCandidatesStore, useJobsStore } from '@/store';
import { Candidate } from '@/types';
import { BoardColumn } from '@/components/pipeline/BoardColumn';
import { CandidateCard } from '@/components/sourcing/CandidateCard';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { CANDIDATE_STATUS_COLORS, CANDIDATE_STATUS_LABELS } from '@/constants/candidate';
import { CandidateProfileModal } from '@/components/sourcing/CandidateProfileModal';
import { CandidateCompactCard } from '@/components/pipeline/CandidateCompactCard';
import { cn } from '@/lib/utils';
import { customCollisionDetection } from '@/lib/dnd-utils';
import { CandidatesFilterPanel } from '@/components/sourcing/CandidatesFilterPanel';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { AddCandidateModal } from '@/components/sourcing/AddCandidateModal';
import { useClickOutside } from '@/hooks';

const COLUMNS = [
    { id: 'New', title: CANDIDATE_STATUS_LABELS['New'], color: CANDIDATE_STATUS_COLORS['New'] },
    { id: 'Screening', title: CANDIDATE_STATUS_LABELS['Screening'], color: CANDIDATE_STATUS_COLORS['Screening'] },
    { id: 'Interview', title: CANDIDATE_STATUS_LABELS['Interview'], color: CANDIDATE_STATUS_COLORS['Interview'] },
    { id: 'Offer', title: CANDIDATE_STATUS_LABELS['Offer'], color: CANDIDATE_STATUS_COLORS['Offer'] },
    { id: 'Rejected', title: CANDIDATE_STATUS_LABELS['Rejected'], color: CANDIDATE_STATUS_COLORS['Rejected'] },
];

export function PipelinePage() {
    // Use centralized stores
    const {
        candidates,
        loading,
        selectedCandidate,
        fetchCandidates,
        deleteCandidate,
        updateCandidateStatus,
        setSelectedCandidate
    } = useCandidatesStore();

    const { jobs, fetchJobs } = useJobsStore();

    // DnD state
    const [activeId, setActiveId] = useState<string | null>(null);

    // Local UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filters, setFilters] = useState({
        status: 'All',
        source: '',
        minScore: '',
        location: '',
        minExperience: '',
        jobId: 'all'
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [candidateToEdit, setCandidateToEdit] = useState<Candidate | undefined>(undefined);

    const filterRef = useRef<HTMLDivElement>(null);

    // Use custom hook instead of manual effect
    useClickOutside(filterRef, () => setIsFilterOpen(false), isFilterOpen);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch data on mount
    useEffect(() => {
        fetchCandidates();
        fetchJobs();
    }, [fetchCandidates, fetchJobs]);

    const findContainer = (id: string) => {
        if (COLUMNS.find(col => col.id === id)) {
            return id;
        }
        const candidate = candidates.find(c => c.id === id);
        return candidate?.status;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Visual update during drag (store handles this)
        updateCandidateStatus(active.id as string, overContainer as Candidate['status']);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id as string);
        const overContainer = over ? findContainer(over.id as string) : null;

        if (
            activeContainer &&
            overContainer &&
            activeContainer !== overContainer
        ) {
            // Store handles the API call and state update
            await updateCandidateStatus(active.id as string, overContainer as Candidate['status']);
        }

        setActiveId(null);
    };

    const handleDeleteClick = (candidate: Candidate) => {
        setCandidateToDelete(candidate);
        setIsDeleteModalOpen(true);
    };

    const handleEditClick = (candidate: Candidate) => {
        setCandidateToEdit(candidate);
        setIsAddModalOpen(true);
    };

    const confirmDelete = async () => {
        if (candidateToDelete) {
            await deleteCandidate(candidateToDelete.id);
            setIsDeleteModalOpen(false);
            setCandidateToDelete(null);
        }
    };

    const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

    // Memoized filtered candidates
    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            // Job Filter
            if (filters.jobId && filters.jobId !== 'all' && c.appliedJobId !== filters.jobId) return false;

            // Search Filter
            const matchesSearch =
                !searchQuery ||
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.role.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Advanced Filters
            if (filters.status !== 'All' && c.status !== filters.status) return false;
            if (filters.source && c.source !== filters.source) return false;
            if (filters.location && !c.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;

            if (filters.minScore) {
                const minScore = parseInt(filters.minScore);
                if (!isNaN(minScore) && c.score < minScore) return false;
            }

            if (filters.minExperience) {
                const minExp = parseInt(filters.minExperience);
                if (!isNaN(minExp) && c.experienceYears < minExp) return false;
            }

            return true;
        });
    }, [candidates, searchQuery, filters]);

    const hasActiveFilters = filters.status !== 'All' || filters.source !== '' ||
        filters.minScore !== '' || filters.location !== '' || filters.minExperience !== '';

    if (loading) return <div className="p-8">Loading pipeline...</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden animate-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-8 pb-4 z-20 relative">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 flex items-center gap-2">
                        Pipeline
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track and manage candidate progress through the hiring stages.
                    </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto items-center">
                    {/* View Toggle */}
                    <div className="bg-muted/50 p-1 rounded-md border border-border flex gap-1 mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            title="Board View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search candidates..."
                            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-background border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm placeholder:text-muted-foreground/70"
                        />
                    </div>

                    {/* Filter Button */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={cn(
                                "p-2 rounded-xl border transition-all relative",
                                isFilterOpen || hasActiveFilters
                                    ? "bg-primary/10 border-primary/50 text-primary"
                                    : "bg-muted/50 hover:bg-muted border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                            )}
                        </button>

                        {isFilterOpen && (
                            <CandidatesFilterPanel
                                filters={filters}
                                jobs={jobs}
                                onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
                                onClearFilters={() => setFilters({
                                    status: 'All',
                                    source: '',
                                    minScore: '',
                                    location: '',
                                    minExperience: '',
                                    jobId: 'all'
                                })}
                                onClose={() => setIsFilterOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={customCollisionDetection}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full gap-5 min-w-max pb-2">
                        {COLUMNS.map(col => (
                            <BoardColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                color={col.color}
                                candidates={filteredCandidates.filter(c => c.status === col.id)}
                                onCandidateClick={setSelectedCandidate}
                                onDelete={handleDeleteClick}
                                viewMode={viewMode}
                                jobs={jobs}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeCandidate ? (
                            viewMode === 'grid' ? (
                                <CandidateCard candidate={activeCandidate} jobTitle={jobs.find(j => j.id === activeCandidate.appliedJobId)?.title} />
                            ) : (
                                <CandidateCompactCard candidate={activeCandidate} jobTitle={jobs.find(j => j.id === activeCandidate.appliedJobId)?.title} />
                            )
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <CandidateProfileModal
                isOpen={!!selectedCandidate}
                candidate={selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                jobTitle={jobs.find(j => j.id === selectedCandidate?.appliedJobId)?.title}
            />

            <AddCandidateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialData={candidateToEdit}
                jobs={jobs}
                onSave={async (newCandidateData) => {
                    const candidateData: Candidate = {
                        id: candidateToEdit?.id || `c${Date.now()}`,
                        name: `${newCandidateData.firstName} ${newCandidateData.lastName}`,
                        email: newCandidateData.email,
                        phone: newCandidateData.phone,
                        role: newCandidateData.role || 'New Candidate',
                        status: candidateToEdit?.status || 'New',
                        source: candidateToEdit?.source || 'CareerPage',
                        score: candidateToEdit?.score || 0,
                        tags: newCandidateData.skills || [],
                        createdAt: candidateToEdit?.createdAt || new Date().toISOString(),
                        location: newCandidateData.location,
                        skills: newCandidateData.skills || [],
                        experienceYears: newCandidateData.experience?.length || 0,
                        photoUrl: newCandidateData.photoUrl,
                        summary: newCandidateData.summary,
                        experience: newCandidateData.experience,
                        education: newCandidateData.education,
                        certifications: newCandidateData.certifications,
                        appliedJobId: newCandidateData.appliedJobId
                    };

                    if (candidateToEdit) {
                        await useCandidatesStore.getState().updateCandidate(candidateData);
                    } else {
                        await useCandidatesStore.getState().addCandidate(candidateData);
                    }
                }}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Candidate"
                description={`Are you sure you want to delete ${candidateToDelete?.name}? This action cannot be undone.`}
            />
        </div>
    );
}
