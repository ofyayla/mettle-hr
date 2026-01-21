import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateBasicInfoSchema, CandidateBasicInfoInput } from '@/lib/validations/candidate';

export interface UseCandidateFormOptions {
    defaultValues?: Partial<CandidateBasicInfoInput>;
    onSubmit?: (data: CandidateBasicInfoInput) => void;
}

/**
 * Hook for managing candidate basic info form with validation
 */
export function useCandidateForm(options: UseCandidateFormOptions = {}) {
    const form = useForm<CandidateBasicInfoInput>({
        resolver: zodResolver(candidateBasicInfoSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
            location: '',
            gender: '',
            dob: '',
            linkedin: '',
            portfolio: '',
            photoUrl: '',
            appliedJobId: '',
            ...options.defaultValues
        },
        mode: 'onBlur' // Validate on blur for better UX
    });

    const handleSubmit = form.handleSubmit((data) => {
        options.onSubmit?.(data);
    });

    return {
        // Form methods
        register: form.register,
        handleSubmit,
        reset: form.reset,
        setValue: form.setValue,
        getValues: form.getValues,
        watch: form.watch,

        // Form state
        errors: form.formState.errors,
        isValid: form.formState.isValid,
        isDirty: form.formState.isDirty,
        isSubmitting: form.formState.isSubmitting,

        // Utility
        clearErrors: form.clearErrors,
        trigger: form.trigger
    };
}

// Re-export types
export type { CandidateBasicInfoInput };
