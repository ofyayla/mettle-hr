import { Plus } from 'lucide-react';

interface AddCandidateCardProps {
    onClick: () => void;
}

export function AddCandidateCard({ onClick }: AddCandidateCardProps) {
    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 h-full min-h-[280px] transition-all p-6 cursor-pointer bg-card/30"
        >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-lg text-foreground">Add Candidate</h3>
                <p className="text-sm text-muted-foreground mt-1">Add a new candidate manually</p>
            </div>
        </button>
    );
}
