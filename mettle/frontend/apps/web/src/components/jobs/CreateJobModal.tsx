import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Job } from '@/types';
import {
    JobFormData,
    AIInputData,
    JobModalMode,
    createEmptyJobFormData,
    createEmptyAIInput
} from '@/types/job-form';
import { ModeSelection, AIInputForm, JobEditForm } from './job-form';
import { generateJobDescription } from '@/services/aiService';
import { useModalKeyboard } from '@/hooks';
import toast from 'react-hot-toast';

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'status'>) => void;
    initialData?: Job | null;
    onUpdate?: (job: Job) => void;
    onDelete?: (id: string) => void;
}

export function CreateJobModal({ isOpen, onClose, onCreate, initialData, onUpdate, onDelete }: CreateJobModalProps) {
    const [mode, setMode] = useState<JobModalMode>('selection');
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState<JobFormData>(createEmptyJobFormData());
    const [aiInput, setAiInput] = useState<AIInputData>(createEmptyAIInput());
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Use custom hook for ESC key
    useModalKeyboard(isOpen, handleClose);

    function resetModal() {
        setMode('selection');
        setFormData(createEmptyJobFormData());
        setAiInput(createEmptyAIInput());
        setErrors({});
    }

    function handleClose() {
        onClose();
        setTimeout(resetModal, 300);
    }

    useEffect(() => {
        if (isOpen && initialData) {
            setMode('edit');
            setFormData({
                title: initialData.title,
                department: initialData.department,
                location: initialData.location,
                type: initialData.type,
                status: initialData.status,
                description: initialData.description || '',
                requirements: initialData.requirements || ['']
            });
        } else if (isOpen && !initialData) {
            if (mode === 'edit' && !formData.title) {
                setMode('selection');
            }
        }
    }, [isOpen, initialData]);

    const validate = (): boolean => {
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
                onUpdate({ ...initialData, ...formData } as Job);
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
            toast.error('Failed to generate job description');
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
            toast.error('Failed to generate job description');
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

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="job-modal-title"
                className="bg-card w-full max-w-2xl h-[90vh] max-h-[800px] rounded-3xl border border-border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden relative"
            >
                {mode === 'selection' && (
                    <ModeSelection
                        onSelectAI={() => setMode('ai-input')}
                        onSelectManual={() => setMode('edit')}
                    />
                )}

                {mode === 'ai-input' && (
                    <AIInputForm
                        aiInput={aiInput}
                        isGenerating={isGenerating}
                        error={errors.title}
                        onBack={() => setMode(initialData || formData.title ? 'edit' : 'selection')}
                        onInputChange={(field, value) => setAiInput(prev => ({ ...prev, [field]: value }))}
                        onGenerate={handleGenerateAI}
                    />
                )}

                {mode === 'edit' && (
                    <JobEditForm
                        formData={formData}
                        errors={errors}
                        isGenerating={isGenerating}
                        isEditing={!!initialData}
                        onFormChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                        onRequirementChange={handleRequirementChange}
                        onAddRequirement={addRequirement}
                        onRemoveRequirement={removeRequirement}
                        onGenerateAI={handleInlineGenerate}
                        onSubmit={handleSubmit}
                        onClose={handleClose}
                        onBack={!initialData ? () => setMode('selection') : undefined}
                        onDelete={initialData && onDelete ? () => onDelete(initialData.id) : undefined}
                    />
                )}
            </div>
        </div>,
        document.body
    );
}
