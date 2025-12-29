import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '@/types';
import { CandidateCard } from '@/components/sourcing/CandidateCard';

interface SortableCandidateCardProps {
    candidate: Candidate;
}

export function SortableCandidateCard({ candidate }: SortableCandidateCardProps) {
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
            <CandidateCard candidate={candidate} />
        </div>
    );
}
