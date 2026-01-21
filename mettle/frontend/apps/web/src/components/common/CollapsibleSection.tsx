import { ReactNode } from 'react';
import { ChevronDown, ChevronUp, Plus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
    title: string;
    icon: LucideIcon;
    isOpen: boolean;
    onToggle: () => void;
    onAdd?: () => void;
    addLabel?: string;
    children: ReactNode;
    className?: string;
}

/**
 * Reusable collapsible section component for forms
 * Eliminates duplicate section header code across form components
 */
export function CollapsibleSection({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    onAdd,
    addLabel = 'Add',
    children,
    className
}: CollapsibleSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex items-center gap-2 group"
                >
                    <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Icon className="w-5 h-5" /> {title}
                    </h3>
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreprground" />
                    )}
                </button>

                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium px-2 py-1 bg-primary/10 rounded-lg transition-colors"
                    >
                        <Plus className="w-3 h-3" /> {addLabel}
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}
