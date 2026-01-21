// Shared types for job form

export interface JobFormData {
    title: string;
    department: string;
    location: string;
    type: string;
    status: string;
    description: string;
    requirements: string[];
}

export interface AIInputData {
    title: string;
    keywords: string;
}

export const createEmptyJobFormData = (): JobFormData => ({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'Open',
    description: '',
    requirements: ['']
});

export const createEmptyAIInput = (): AIInputData => ({
    title: '',
    keywords: ''
});

export type JobModalMode = 'selection' | 'ai-input' | 'edit';

// Employment types
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'] as const;

// Job statuses
export const JOB_STATUSES = ['Open', 'Draft', 'Closed'] as const;
