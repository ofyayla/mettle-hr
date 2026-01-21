import { X, Plus, Trash2, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobFormData, EMPLOYMENT_TYPES, JOB_STATUSES } from '@/types/job-form';

interface JobEditFormProps {
    formData: JobFormData;
    errors: Record<string, string>;
    isGenerating: boolean;
    isEditing: boolean;
    onFormChange: (field: keyof JobFormData, value: string | string[]) => void;
    onRequirementChange: (index: number, value: string) => void;
    onAddRequirement: () => void;
    onRemoveRequirement: (index: number) => void;
    onGenerateAI: () => void;
    onSubmit: () => void;
    onClose: () => void;
    onBack?: () => void;
    onDelete?: () => void;
}

/**
 * Job edit form component
 */
export function JobEditForm({
    formData,
    errors,
    isGenerating,
    isEditing,
    onFormChange,
    onRequirementChange,
    onAddRequirement,
    onRemoveRequirement,
    onGenerateAI,
    onSubmit,
    onClose,
    onBack,
    onDelete
}: JobEditFormProps) {
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-card z-10">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
                            title="Back to mode selection"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEditing ? 'Edit Job' : (formData.title || 'Create New Job')}
                        </h2>
                        <p className="text-sm text-muted-foreground">Refine the details before publishing.</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onFormChange('title', e.target.value)}
                            className={cn(
                                "w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                errors.title ? "border-red-500 focus:border-red-500" : "border-border/50 focus:border-primary/50"
                            )}
                            placeholder="e.g. Senior Frontend Engineer"
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Employment Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => onFormChange('type', e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {EMPLOYMENT_TYPES.map(type => (
                                <option key={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => onFormChange('status', e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {JOB_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => onFormChange('department', e.target.value)}
                            className={cn(
                                "w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                errors.department ? "border-red-500 focus:border-red-500" : "border-border/50 focus:border-primary/50"
                            )}
                            placeholder="e.g. Engineering"
                        />
                        {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => onFormChange('location', e.target.value)}
                            className={cn(
                                "w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                errors.location ? "border-red-500 focus:border-red-500" : "border-border/50 focus:border-primary/50"
                            )}
                            placeholder="e.g. Remote, New York, NY"
                        />
                        {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Job Description <span className="text-red-500">*</span></label>
                        <button
                            onClick={onGenerateAI}
                            disabled={isGenerating}
                            className="text-xs flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg bg-secondary-teal text-teal-950 hover:bg-secondary-teal/80 dark:bg-secondary-teal/10 dark:text-secondary-teal dark:hover:bg-secondary-teal/20"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Sparkles className="w-3 h-3" />
                            )}
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>

                    <textarea
                        value={formData.description}
                        onChange={(e) => onFormChange('description', e.target.value)}
                        rows={8}
                        className={cn(
                            "w-full px-4 py-3 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none",
                            errors.description ? "border-red-500 focus:border-red-500" : "border-border/50 focus:border-primary/50"
                        )}
                        placeholder="Describe the role responsibilities and expectations..."
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Key Requirements</label>
                        <button
                            onClick={onAddRequirement}
                            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Requirement
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.requirements.map((req, index) => (
                            <div key={index} className="flex gap-2 group">
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => onRequirementChange(index, e.target.value)}
                                    className="flex-1 px-4 py-2 bg-background border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm"
                                    placeholder={`Requirement ${index + 1}`}
                                />
                                {formData.requirements.length > 1 && (
                                    <button
                                        onClick={() => onRemoveRequirement(index)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-muted/20 flex items-center justify-between sticky bottom-0 rounded-b-3xl mt-auto">
                <div className="flex-1">
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Job
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-border/50 hover:bg-muted text-muted-foreground font-medium transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25"
                    >
                        {isEditing ? 'Update Job' : 'Create Job'}
                    </button>
                </div>
            </div>
        </div>
    );
}
