import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Candidate, Job } from '@/types';
import { CandidateCard } from '@/components/sourcing/CandidateCard';
import { CandidatesHeader } from '@/components/sourcing/CandidatesHeader';
import { CandidateListRow } from '@/components/sourcing/CandidateListRow';
import { AddCandidateModal } from '@/components/sourcing/AddCandidateModal';
import { CandidateProfileModal } from '@/components/sourcing/CandidateProfileModal';
import { AddCandidateCard } from '@/components/sourcing/AddCandidateCard';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { Search, ArrowUpDown } from 'lucide-react';

export function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'All',
        source: '',
        minScore: '',
        location: '',
        minExperience: ''
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
    const [candidateToEdit, setCandidateToEdit] = useState<Candidate | undefined>(undefined);

    const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate | null; direction: 'asc' | 'desc' }>({
        key: 'score',
        direction: 'desc'
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [candidatesData, jobsData] = await Promise.all([
                    api.candidates.list(),
                    api.jobs.list()
                ]);
                setCandidates(candidatesData);
                setJobs(jobsData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDeleteClick = (candidate: Candidate) => {
        setCandidateToDelete(candidate);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (candidateToDelete) {
            setCandidates(prev => prev.filter(c => c.id !== candidateToDelete.id));
            setIsDeleteModalOpen(false);
            setCandidateToDelete(null);
            setSelectedCandidate(null); // Close profile modal if open
        }
    };

    const filteredCandidates = candidates.filter(c => {
        // Global Search
        const matchesSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        // Specific Filters
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
        return true;
    });

    const handleSort = (key: keyof Candidate) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedCandidates = [...filteredCandidates].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            status: 'All',
            source: '',
            minScore: '',
            location: '',
            minExperience: ''
        });
    };

    const handleCandidateUpdate = (updatedCandidate: Candidate) => {
        setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        if (selectedCandidate?.id === updatedCandidate.id) {
            setSelectedCandidate(updatedCandidate);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto h-full animate-in">
            <CandidatesHeader
                viewMode={viewMode}
                onViewChange={setViewMode}
                searchQuery={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onAddCandidate={() => {
                    setCandidateToEdit(undefined);
                    setIsAddModalOpen(true);
                }}
                totalCandidates={sortedCandidates.length}
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-xl border border-border/50"></div>
                    ))}
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedCandidates.map(candidate => (
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    onClick={setSelectedCandidate}
                                    onDelete={handleDeleteClick}
                                    jobTitle={jobs.find(j => j.id === candidate.appliedJobId)?.title}
                                />
                            ))}
                            <AddCandidateCard onClick={() => {
                                setCandidateToEdit(undefined);
                                setIsAddModalOpen(true);
                            }} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {/* List Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground">
                                <div onClick={() => handleSort('name')} className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                    Name
                                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                                </div>
                                <div className="col-span-3 flex items-center gap-1">
                                    Applied Role
                                </div>
                                <div onClick={() => handleSort('createdAt')} className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                    Applied Date
                                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-100 transition-opacity" />
                                </div>
                                <div onClick={() => handleSort('score')} className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group/head">
                                    Score
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

                            {sortedCandidates.map(candidate => (
                                <CandidateListRow
                                    key={candidate.id}
                                    candidate={candidate}
                                    jobTitle={jobs.find(j => j.id === candidate.appliedJobId)?.title}
                                    onClick={setSelectedCandidate}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}

                    {sortedCandidates.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <Search className="w-12 h-12 opacity-20 mb-4" />
                            <h3 className="text-lg font-medium">No candidates found</h3>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </>
            )}

            <AddCandidateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialData={candidateToEdit}
                jobs={jobs}
                onSave={(newCandidateData) => {
                    if (candidateToEdit) {
                        // Update existing
                        setCandidates(prev => prev.map(c => c.id === candidateToEdit.id ? {
                            ...c,
                            name: `${newCandidateData.firstName} ${newCandidateData.lastName}`,
                            email: newCandidateData.email,
                            phone: newCandidateData.phone,
                            role: newCandidateData.role,
                            location: newCandidateData.location,
                            skills: newCandidateData.skills,
                            photoUrl: newCandidateData.photoUrl || c.photoUrl,
                            summary: newCandidateData.summary,
                            experience: newCandidateData.experience,
                            education: newCandidateData.education,
                            certifications: newCandidateData.certifications,
                            appliedJobId: newCandidateData.appliedJobId
                        } : c));

                        // Also update selected candidate if it's the one being edited
                        if (selectedCandidate?.id === candidateToEdit.id) {
                            setSelectedCandidate(prev => prev ? ({
                                ...prev,
                                name: `${newCandidateData.firstName} ${newCandidateData.lastName}`,
                                email: newCandidateData.email,
                                phone: newCandidateData.phone,
                                role: newCandidateData.role,
                                location: newCandidateData.location,
                                skills: newCandidateData.skills,
                                photoUrl: newCandidateData.photoUrl || prev.photoUrl,
                                summary: newCandidateData.summary,
                                experience: newCandidateData.experience,
                                education: newCandidateData.education,
                                certifications: newCandidateData.certifications,
                                appliedJobId: newCandidateData.appliedJobId
                            }) : null);
                        }
                    } else {
                        // Create new
                        const newCandidate: Candidate = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: `${newCandidateData.firstName} ${newCandidateData.lastName}`,
                            email: newCandidateData.email,
                            phone: newCandidateData.phone,
                            role: newCandidateData.role || 'New Candidate',
                            status: 'New',
                            source: 'CareerPage',
                            score: 0,
                            tags: newCandidateData.skills || [],
                            createdAt: new Date().toISOString(),
                            location: newCandidateData.location,
                            skills: newCandidateData.skills || [],
                            experienceYears: newCandidateData.experience.length * 2, // Approximate
                            photoUrl: newCandidateData.photoUrl,
                            summary: newCandidateData.summary,
                            experience: newCandidateData.experience,
                            education: newCandidateData.education,
                            certifications: newCandidateData.certifications,
                            appliedJobId: newCandidateData.appliedJobId
                        };
                        setCandidates(prev => [newCandidate, ...prev]);
                    }
                }}
            />

            <CandidateProfileModal
                isOpen={!!selectedCandidate}
                candidate={selectedCandidate}
                jobTitle={jobs.find(j => j.id === selectedCandidate?.appliedJobId)?.title}
                onClose={() => setSelectedCandidate(null)}
                onDelete={handleDeleteClick}
                onEdit={(candidate) => {
                    setCandidateToEdit(candidate);
                    setIsAddModalOpen(true);
                }}
                onUpdate={handleCandidateUpdate}
            />

            {/* Delete Confirmation Modal */}
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
