import { ArrowLeft, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { AIInputData } from '@/types/job-form';

interface AIInputFormProps {
    aiInput: AIInputData;
    isGenerating: boolean;
    error?: string;
    onBack: () => void;
    onInputChange: (field: keyof AIInputData, value: string) => void;
    onGenerate: () => void;
}

/**
 * AI input form for generating job descriptions
 */
export function AIInputForm({
    aiInput,
    isGenerating,
    error,
    onBack,
    onInputChange,
    onGenerate
}: AIInputFormProps) {
    return (
        <div className="p-8 flex flex-col max-w-xl mx-auto w-full gap-6 animate-in slide-in-from-right-8 duration-200">
            <button
                onClick={onBack}
                className="self-start text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="text-center space-y-2 mb-4">
                <div className="w-12 h-12 bg-secondary-teal/10 text-secondary-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Describe Your Role</h2>
                <p className="text-muted-foreground">We'll use this to generate a first draft for you.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={aiInput.title}
                        onChange={(e) => onInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-secondary-teal/20 focus:border-secondary-teal transition-all outline-none text-lg placeholder:text-muted-foreground/50"
                        placeholder="e.g. Senior Product Manager"
                        autoFocus
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Key Skills / Keywords (Optional)</label>
                    <input
                        type="text"
                        value={aiInput.keywords}
                        onChange={(e) => onInputChange('keywords', e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-secondary-teal/20 focus:border-secondary-teal transition-all outline-none text-sm placeholder:text-muted-foreground/50"
                        placeholder="e.g. React, Agile, Leadership"
                    />
                    <p className="text-xs text-muted-foreground">Separate with commas</p>
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary-teal text-white font-bold hover:shadow-lg hover:shadow-secondary-teal/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Magic...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-5 h-5" />
                        Generate Job Description
                    </>
                )}
            </button>
        </div>
    );
}
