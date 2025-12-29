
import { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { api } from '@/services/api';
import { Candidate } from '@/types';
import { BoardColumn } from '@/components/pipeline/BoardColumn';
import { CandidateCard } from '@/components/sourcing/CandidateCard';
import { MessageSquare } from 'lucide-react';

const COLUMNS = [
    { id: 'New', title: 'Yeni Başvuru', color: 'bg-blue-500' },
    { id: 'Screening', title: 'Değerlendirme', color: 'bg-yellow-500' },
    { id: 'Interview', title: 'Mülakat', color: 'bg-purple-500' },
    { id: 'Offer', title: 'Teklif', color: 'bg-[hsl(105,99%,73%)]' },
    { id: 'Rejected', title: 'Reddedildi', color: 'bg-[hsl(3,79%,77%)]' },
];

export function PipelinePage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        api.candidates.list().then(data => {
            setCandidates(data);
            setLoading(false);
        });
    }, []);

    const findContainer = (id: string) => {
        if (COLUMNS.find(col => col.id === id)) {
            return id;
        }
        const candidate = candidates.find(c => c.id === id);
        return candidate?.status;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setCandidates((prev) => {
            return prev.map(c => {
                if (c.id === active.id) {
                    return { ...c, status: overContainer as any };
                }
                return c;
            });
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id as string);
        const overContainer = over ? findContainer(over.id as string) : null;

        if (
            activeContainer &&
            overContainer &&
            activeContainer !== overContainer
        ) {
            setCandidates((prev) => {
                return prev.map(c => {
                    if (c.id === active.id) {
                        return { ...c, status: overContainer as any };
                    }
                    return c;
                });
            });
        }

        setActiveId(null);
    };

    const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

    if (loading) return <div className="p-8">Loading pipeline...</div>;

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <div className="p-6 pb-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    Aday Takip (Pipeline)
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Adayları süreçler arasında sürükleyip bırakarak taşıyın.
                </p>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full gap-4">
                        {COLUMNS.map(col => (
                            <BoardColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                color={col.color}
                                candidates={candidates.filter(c => c.status === col.id)}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeCandidate ? <CandidateCard candidate={activeCandidate} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
