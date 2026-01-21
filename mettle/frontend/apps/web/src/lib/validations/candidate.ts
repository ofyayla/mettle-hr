import { z } from 'zod';

// Candidate basic info schema
export const candidateBasicInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.string().optional(),
    location: z.string().optional(),
    gender: z.string().optional(),
    dob: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
    photoUrl: z.string().optional(),
    appliedJobId: z.string().optional()
});

// Work experience schema
export const workExperienceSchema = z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    current: z.boolean(),
    description: z.string()
});

// Education schema
export const educationSchema = z.object({
    id: z.string(),
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    grade: z.string(),
    activities: z.string()
});

// Certification schema
export const certificationSchema = z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    expirationDate: z.string(),
    credentialId: z.string()
});

// Full candidate form schema
export const candidateFormSchema = z.object({
    basicInfo: candidateBasicInfoSchema,
    summary: z.string().optional(),
    skills: z.string().optional(),
    experience: z.array(workExperienceSchema),
    education: z.array(educationSchema),
    certifications: z.array(certificationSchema)
});

// Type inference
export type CandidateBasicInfoInput = z.infer<typeof candidateBasicInfoSchema>;
export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type CandidateFormInput = z.infer<typeof candidateFormSchema>;
