import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '@/types';
import { CandidateCompactCard } from './CandidateCompactCard';
import { CandidateCard } from '@/components/sourcing/CandidateCard';

interface SortableCandidateCardProps {
    candidate: Candidate;
    onClick?: (candidate: Candidate) => void;
    viewMode?: 'grid' | 'list';
    jobTitle?: string;
    onDelete?: (candidate: Candidate) => void;
}

export function SortableCandidateCard({ candidate, onClick, viewMode = 'grid', jobTitle, onDelete }: SortableCandidateCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: candidate.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            {viewMode === 'grid' ? (
                <CandidateCard candidate={candidate} onClick={onClick} onDelete={onDelete} jobTitle={jobTitle} />
            ) : (
                <CandidateCompactCard candidate={candidate} onClick={onClick} jobTitle={jobTitle} />
            )}
        </div>
    );
}
