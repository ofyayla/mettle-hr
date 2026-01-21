import { Trash2 } from 'lucide-react';
import { Education } from '@/types/candidate-form';

interface EducationItemProps {
    education: Education;
    onUpdate: (id: string, field: keyof Education, value: string) => void;
    onRemove: (id: string) => void;
}

/**
 * Single education item in the candidate form
 */
export function EducationItem({ education, onUpdate, onRemove }: EducationItemProps) {
    return (
        <div className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4 relative group">
            <button
                type="button"
                onClick={() => onRemove(education.id)}
                className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4 mr-8">
                <input
                    value={education.school}
                    onChange={(e) => onUpdate(education.id, 'school', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm font-semibold placeholder:font-normal focus:border-primary/50 outline-none"
                    placeholder="School / University"
                />
                <input
                    value={education.degree}
                    onChange={(e) => onUpdate(education.id, 'degree', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 outline-none"
                    placeholder="Degree (e.g. BS Computer Science)"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <input
                    value={education.startDate}
                    onChange={(e) => onUpdate(education.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="Start Date"
                />
                <input
                    value={education.endDate}
                    onChange={(e) => onUpdate(education.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="End Date"
                />
                <input
                    value={education.activities}
                    onChange={(e) => onUpdate(education.id, 'activities', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="Activities / Grade"
                />
            </div>
        </div>
    );
}
