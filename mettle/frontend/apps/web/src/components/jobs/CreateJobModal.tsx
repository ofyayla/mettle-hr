import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Sparkles, Wand2, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Job } from '@/types';
import { generateJobDescription } from '@/services/aiService';

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'status'>) => void;
    initialData?: Job | null;
    onUpdate?: (job: Job) => void;
    onDelete?: (id: string) => void;
}

type ModalMode = 'selection' | 'ai-input' | 'edit';

export function CreateJobModal({ isOpen, onClose, onCreate, initialData, onUpdate, onDelete }: CreateJobModalProps) {
    const [mode, setMode] = useState<ModalMode>('selection');
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        status: 'Open',
        description: '',
        requirements: ['']
    });

    const [aiInput, setAiInput] = useState({
        title: '',
        keywords: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetModal = () => {
        setMode('selection');
        setFormData({
            title: '',
            department: '',
            location: '',
            type: 'Full-time',
            status: 'Open',
            description: '',
            requirements: ['']
        });
        setAiInput({ title: '', keywords: '' });
        setErrors({});
    };

    const handleClose = () => {
        onClose();
        // Small delay to reset state after animation finishes if needed, 
        // but for now just resetting immediately is fine or on next open.
        setTimeout(resetModal, 300);
    };

    useEffect(() => {
        if (isOpen && initialData) {
            setMode('edit');
            setFormData({
                title: initialData.title,
                department: initialData.department,
                location: initialData.location,
                type: initialData.type,
                status: initialData.status,
                description: initialData.description || '', // Assuming description might be optional in type but required in form
                requirements: initialData.requirements || [''] // Same assumption
            });
        } else if (isOpen && !initialData) {
            // Reset to selection mode if opening fresh
            if (mode === 'edit' && !formData.title) {
                setMode('selection');
            }
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title) newErrors.title = 'Job title is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.description) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            if (initialData && onUpdate) {
                onUpdate({
                    ...initialData,
                    ...formData,
                    // Ensure we keep existing fields
                } as Job);
            } else {
                onCreate(formData as any);
            }
            handleClose();
        }
    };

    const handleGenerateAI = async () => {
        if (!aiInput.title) {
            setErrors({ title: 'Job title is required for AI generation' });
            return;
        }

        setIsGenerating(true);
        try {
            const keywordsList = aiInput.keywords.split(',').map(k => k.trim()).filter(k => k);
            const response = await generateJobDescription({
                title: aiInput.title,
                keywords: keywordsList
            });

            setFormData({
                ...formData,
                title: aiInput.title,
                description: response.description,
                requirements: response.requirements,
                department: response.suggestedDepartment,
                type: response.suggestedType
            });
            setMode('edit');
        } catch (error) {
            console.error(error);
            // Handle error appropriately
        } finally {
            setIsGenerating(false);
        }
    };

    const handleInlineGenerate = async () => {
        if (!formData.title) {
            setErrors(prev => ({ ...prev, title: 'Job title is required for AI generation' }));
            return;
        }

        setIsGenerating(true);
        try {
            const response = await generateJobDescription({
                title: formData.title,
                keywords: []
            });

            setFormData(prev => ({
                ...prev,
                description: response.description,
                requirements: response.requirements
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRequirementChange = (index: number, value: string) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData({ ...formData, requirements: newRequirements });
    };

    const addRequirement = () => {
        setFormData({ ...formData, requirements: [...formData.requirements, ''] });
    };

    const removeRequirement = (index: number) => {
        const newRequirements = formData.requirements.filter((_, i) => i !== index);
        setFormData({ ...formData, requirements: newRequirements });
    };

    // --- Renders ---

    const renderSelectionMode = () => (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-teal">
                    How would you like to start?
                </h2>
                <p className="text-muted-foreground">Choose the best way to create your new job posting.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                    onClick={() => setMode('ai-input')}
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
                    onClick={() => setMode('edit')}
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

    const renderAiInputMode = () => (
        <div className="p-8 flex flex-col max-w-xl mx-auto w-full gap-6 animate-in slide-in-from-right-8 duration-200">
            <button
                onClick={() => setMode(initialData || formData.title ? 'edit' : 'selection')}
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
                        onChange={(e) => setAiInput({ ...aiInput, title: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-secondary-teal/20 focus:border-secondary-teal transition-all outline-none text-lg placeholder:text-muted-foreground/50"
                        placeholder="e.g. Senior Product Manager"
                        autoFocus
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Key Skills / Keywords (Optional)</label>
                    <input
                        type="text"
                        value={aiInput.keywords}
                        onChange={(e) => setAiInput({ ...aiInput, keywords: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-secondary-teal/20 focus:border-secondary-teal transition-all outline-none text-sm placeholder:text-muted-foreground/50"
                        placeholder="e.g. React, Agile, Leadership"
                    />
                    <p className="text-xs text-muted-foreground">Separate with commas</p>
                </div>
            </div>

            <button
                onClick={handleGenerateAI}
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

    const renderEditMode = () => (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-card z-10">
                <div className="flex items-center gap-4">
                    {!initialData && (
                        <button
                            onClick={() => setMode('selection')}
                            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
                            title="Back to mode selection"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                    <div>
                        <h2 className="text-xl font-bold">
                            {initialData ? 'Edit Job' : (formData.title ? formData.title : 'Create New Job')}
                        </h2>
                        <p className="text-sm text-muted-foreground">Refine the details before publishing.</p>
                    </div>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-muted rounded-full transition-colors">
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
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                            <option>Internship</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="Open">Open</option>
                            <option value="Draft">Draft</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                            onClick={handleInlineGenerate}
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
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                            onClick={addRequirement}
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
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    className="flex-1 px-4 py-2 bg-background border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm"
                                    placeholder={`Requirement ${index + 1}`}
                                />
                                {formData.requirements.length > 1 && (
                                    <button
                                        onClick={() => removeRequirement(index)}
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
                    {initialData && onDelete && (
                        <button
                            onClick={() => onDelete(initialData.id)}
                            className="px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Job
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-xl border border-border/50 hover:bg-muted text-muted-foreground font-medium transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25"
                    >
                        {initialData ? 'Update Job' : 'Create Job'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="bg-card w-full max-w-2xl h-[90vh] max-h-[800px] rounded-3xl border border-border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden relative">
                {mode === 'selection' && renderSelectionMode()}
                {mode === 'ai-input' && renderAiInputMode()}
                {mode === 'edit' && renderEditMode()}
            </div>
        </div>,
        document.body
    );
}
