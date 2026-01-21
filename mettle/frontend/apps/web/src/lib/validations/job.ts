import { z } from 'zod';

// Job form schema
export const jobFormSchema = z.object({
    title: z.string().min(1, 'Job title is required'),
    department: z.string().min(1, 'Department is required'),
    location: z.string().min(1, 'Location is required'),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
    status: z.enum(['Open', 'Draft', 'Closed']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    requirements: z.array(z.string()).min(1, 'At least one requirement is needed')
});

// AI input schema
export const aiInputSchema = z.object({
    title: z.string().min(1, 'Job title is required for AI generation'),
    keywords: z.string().optional()
});

// Type inference
export type JobFormInput = z.infer<typeof jobFormSchema>;
export type AIInputFormData = z.infer<typeof aiInputSchema>;
