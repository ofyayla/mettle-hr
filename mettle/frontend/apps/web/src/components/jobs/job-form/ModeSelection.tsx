import { Sparkles, Wand2, Plus } from 'lucide-react';
import { JobModalMode } from '@/types/job-form';

interface ModeSelectionProps {
    onSelectAI: () => void;
    onSelectManual: () => void;
}

/**
 * Mode selection screen for Create Job Modal
 */
export function ModeSelection({ onSelectAI, onSelectManual }: ModeSelectionProps) {
    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-teal">
                    How would you like to start?
                </h2>
                <p className="text-muted-foreground">Choose the best way to create your new job posting.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                    onClick={onSelectAI}
                    className="group relative p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-left space-y-4 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-24 h-24 rotate-12" />
                    </div>
                    <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-2">
                        <Wand2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">Draft with AI</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Enter a title and let our AI generate the description and requirements for you.
                        </p>
                    </div>
                </button>

                <button
                    onClick={onSelectManual}
                    className="group p-6 rounded-2xl border-2 border-border hover:border-foreground/20 hover:bg-muted/50 transition-all text-left space-y-4"
                >
                    <div className="bg-muted w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-foreground mb-2 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">Start from Scratch</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manually fill in all the details for a completely custom job posting.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}
