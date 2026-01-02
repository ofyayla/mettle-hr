import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Candidate } from '@/types';
import { SortableCandidateCard } from './SortableCandidateCard';
import { cn } from '@/lib/utils';


import { Job } from '@/types';

interface BoardColumnProps {
    id: string; // The status string e.g. 'Screening'
    title: string;
    candidates: Candidate[];
    color?: string; // Optional accent color
    onCandidateClick?: (candidate: Candidate) => void;
    viewMode?: 'grid' | 'list';
    jobs?: Job[];
    onDelete?: (candidate: Candidate) => void;
}

export function BoardColumn({ id, title, candidates, color = "bg-gray-500", onCandidateClick, viewMode = 'grid', jobs = [], onDelete }: BoardColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className={cn(
            "flex flex-col h-full flex-1 bg-muted/30 rounded-xl border border-border/50 overflow-hidden flex-shrink-0 transition-all",
            viewMode === 'list' ? "min-w-[450px]" : "min-w-[450px]"
        )}>
            {/* Header */}
            <div className="p-3 border-b border-border bg-card flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", color)}></div>
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground font-medium">
                        {candidates.length}
                    </span>
                </div>
            </div>

            {/* Droppable Area */}
            <SortableContext id={id} items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {candidates.map(candidate => (
                        <SortableCandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            onClick={onCandidateClick}
                            onDelete={onDelete}
                            viewMode={viewMode}
                            jobTitle={jobs.find(j => j.id === candidate.appliedJobId)?.title}
                        />
                    ))}
                    {candidates.length === 0 && (
                        <div className="h-full flex items-center justify-center text-muted-foreground/30 text-sm border-2 border-dashed border-border rounded-lg min-h-[100px]">
                            Drop candidates here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
