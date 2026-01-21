import { Trash2 } from 'lucide-react';
import { WorkExperience } from '@/types/candidate-form';

interface ExperienceItemProps {
    experience: WorkExperience;
    onUpdate: (id: string, field: keyof WorkExperience, value: string | boolean) => void;
    onRemove: (id: string) => void;
}

/**
 * Single experience item in the candidate form
 */
export function ExperienceItem({ experience, onUpdate, onRemove }: ExperienceItemProps) {
    return (
        <div className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4 relative group">
            <button
                type="button"
                onClick={() => onRemove(experience.id)}
                className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4 mr-8">
                <div className="space-y-1">
                    <input
                        value={experience.title}
                        onChange={(e) => onUpdate(experience.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm font-semibold placeholder:font-normal focus:border-primary/50 outline-none"
                        placeholder="Job Title"
                    />
                </div>
                <div className="space-y-1">
                    <input
                        value={experience.company}
                        onChange={(e) => onUpdate(experience.id, 'company', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 outline-none"
                        placeholder="Company"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <input
                    value={experience.startDate}
                    onChange={(e) => onUpdate(experience.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="Start Date (e.g. Jan 2020)"
                />
                <input
                    value={experience.endDate}
                    onChange={(e) => onUpdate(experience.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="End Date (or Present)"
                />
                <input
                    value={experience.location}
                    onChange={(e) => onUpdate(experience.id, 'location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none"
                    placeholder="Location"
                />
            </div>

            <textarea
                value={experience.description}
                onChange={(e) => onUpdate(experience.id, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none resize-none"
                placeholder="Job description..."
            />
        </div>
    );
}
