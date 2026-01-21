import { useState } from 'react';
import { GripVertical, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stage {
    id: string;
    name: string;
    type: 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
    timeLimitDays?: number;
    autoEmail: boolean;
}

const initialStages: Stage[] = [
    { id: '1', name: 'Applied', type: 'screening', autoEmail: true },
    { id: '2', name: 'Screening', type: 'screening', timeLimitDays: 3, autoEmail: false },
    { id: '3', name: 'Interview', type: 'interview', timeLimitDays: 5, autoEmail: false },
    { id: '4', name: 'Offer', type: 'offer', timeLimitDays: 2, autoEmail: true },
    { id: '5', name: 'Hired', type: 'hired', autoEmail: true },
];

export function PipelineSettingsPage() {
    const [stages, setStages] = useState(initialStages);

    // Mock drag and drop reordering
    const moveStage = (dragIndex: number, hoverIndex: number) => {
        const newStages = [...stages];
        const draggedStage = newStages[dragIndex];
        newStages.splice(dragIndex, 1);
        newStages.splice(hoverIndex, 0, draggedStage);
        setStages(newStages);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Pipeline Configuration</h3>
                <p className="text-sm text-muted-foreground">
                    Customize your hiring pipeline stages. Drag to reorder.
                </p>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="space-y-4">
                {stages.map((stage, index) => (
                    <div
                        key={stage.id}
                        className={cn(
                            "group flex items-center justify-between p-4 rounded-lg border border-input bg-card hover:border-primary/50 transition-all",
                            stage.type === 'hired' && "bg-green-50/50 border-green-200"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <button className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-5 w-5" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                                    stage.type === 'screening' && "bg-blue-100 text-blue-700",
                                    stage.type === 'interview' && "bg-purple-100 text-purple-700",
                                    stage.type === 'offer' && "bg-amber-100 text-amber-700",
                                    stage.type === 'hired' && "bg-green-100 text-green-700"
                                )}>
                                    {index + 1}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium leading-none">{stage.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="uppercase tracking-wider opacity-70">{stage.type}</span>
                                        {stage.timeLimitDays && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Target: {stage.timeLimitDays} days
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full",
                                    stage.autoEmail ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                )}>
                                    {stage.autoEmail ? "Auto-Email On" : "Manual Email"}
                                </span>
                            </div>
                            <button className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                <button className="w-full py-4 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                    <Plus className="h-5 w-5" />
                    Add New Stage
                </button>
            </div>
        </div>
    );
}
