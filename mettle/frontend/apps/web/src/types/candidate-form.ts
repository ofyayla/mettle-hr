// Shared types for candidate form
export interface WorkExperience {
    id: string;
    title: string;
    company: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    grade: string;
    activities: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate: string;
    credentialId: string;
}

export interface CandidateBasicInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    gender: string;
    dob: string;
    linkedin: string;
    portfolio: string;
    photoUrl?: string;
    appliedJobId?: string;
}

export interface CandidateFormData {
    basicInfo: CandidateBasicInfo;
    summary: string;
    skills: string;
    experience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
}

// Initial state factories
export const createEmptyBasicInfo = (): CandidateBasicInfo => ({
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
    appliedJobId: ''
});

export const createEmptyExperience = (): WorkExperience => ({
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: '',
    company: '',
    type: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
});

export const createEmptyEducation = (): Education => ({
    id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    activities: ''
});

export const createEmptyCertification = (): Certification => ({
    id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    credentialId: ''
});
