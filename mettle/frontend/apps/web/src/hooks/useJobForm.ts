import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobFormSchema, JobFormInput } from '@/lib/validations/job';

export interface UseJobFormOptions {
    defaultValues?: Partial<JobFormInput>;
    onSubmit?: (data: JobFormInput) => void;
}

/**
 * Hook for managing job form with validation
 */
export function useJobForm(options: UseJobFormOptions = {}) {
    const form = useForm<JobFormInput>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            title: '',
            department: '',
            location: '',
            type: 'Full-time',
            status: 'Open',
            description: '',
            requirements: [''],
            ...options.defaultValues
        },
        mode: 'onBlur'
    });

    const handleSubmit = form.handleSubmit((data) => {
        options.onSubmit?.(data);
    });

    return {
        register: form.register,
        handleSubmit,
        reset: form.reset,
        setValue: form.setValue,
        getValues: form.getValues,
        watch: form.watch,
        errors: form.formState.errors,
        isValid: form.formState.isValid,
        isDirty: form.formState.isDirty,
        isSubmitting: form.formState.isSubmitting,
        clearErrors: form.clearErrors,
        trigger: form.trigger
    };
}

export type { JobFormInput };
