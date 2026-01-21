import { Trash2 } from 'lucide-react';
import { Certification } from '@/types/candidate-form';

interface CertificationItemProps {
    certification: Certification;
    onUpdate: (id: string, field: keyof Certification, value: string) => void;
    onRemove: (id: string) => void;
}

/**
 * Single certification item in the candidate form
 */
export function CertificationItem({ certification, onUpdate, onRemove }: CertificationItemProps) {
    return (
        <div className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4 relative group">
            <button
                type="button"
                onClick={() => onRemove(certification.id)}
                className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4 mr-8">
                <input
                    value={certification.name}
                    onChange={(e) => onUpdate(certification.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm font-semibold placeholder:font-normal focus:border-primary/50 outline-none"
                    placeholder="Certification Name"
                />
                <input
                    value={certification.issuer}
                    onChange={(e) => onUpdate(certification.id, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 outline-none"
                    placeholder="Issuing Organization"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input
                    value={certification.issueDate}
                    onChange={(e) => onUpdate(certification.id, 'issueDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="Issue Date"
                />
                <input
                    value={certification.credentialId}
                    onChange={(e) => onUpdate(certification.id, 'credentialId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="Credential ID"
                />
            </div>
        </div>
    );
}
