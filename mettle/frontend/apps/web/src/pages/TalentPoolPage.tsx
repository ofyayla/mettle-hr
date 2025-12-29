import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Candidate } from '@/types';
import { CandidateCard } from '@/components/sourcing/CandidateCard';
import { Search, Filter, Plus, Users, Chrome as ChromeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddCandidateModal } from '@/components/sourcing/AddCandidateModal';

export function TalentPoolPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await api.candidates.list();
                setCandidates(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col h-full bg-background animate-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 pb-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Yetenek Havuzu
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {candidates.length}
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Adayları arayın, filtreleyin ve işe alım sürecine dahil edin.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors group relative">
                        <ChromeIcon className="w-4 h-4 text-blue-500" />
                        <span>Chrome Eklentisi</span>
                        <div className="hidden group-hover:block absolute top-full mt-2 right-0 w-64 p-3 bg-popover border border-border rounded-lg shadow-xl z-50">
                            <p className="text-xs text-muted-foreground font-normal">
                                LinkedIn profilindeyken tek tıkla aday eklemek için <a href="#" className="text-primary hover:underline">eklentiyi indirin</a>.
                            </p>
                        </div>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow hover:brightness-110 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Aday Ekle
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pb-4">
                <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="İsim, rol veya yetenek ara..."
                            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        {['All', 'New', 'Screening', 'Interview', 'Offer', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap",
                                    filterStatus === status
                                        ? "bg-primary/20 border-primary text-primary-700 dark:text-primary-foreground"
                                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {status === 'All' ? 'Tümü' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-xl border border-border/50"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCandidates.map(candidate => (
                            <CandidateCard key={candidate.id} candidate={candidate} />
                        ))}
                        {filteredCandidates.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                <Search className="w-12 h-12 opacity-20 mb-4" />
                                <h3 className="text-lg font-medium">Aday bulunamadı</h3>
                                <p className="text-sm">Arama kriterlerinizi değiştirip tekrar deneyin.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AddCandidateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
