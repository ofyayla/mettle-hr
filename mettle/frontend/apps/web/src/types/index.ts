export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    role: string; // e.g. "Senior React Developer"
    source: 'LinkedIn' | 'GitHub' | 'Referral' | 'CareerPage' | 'Indeed';
    status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
    score: number; // 0-100 AI Score
    tags: string[];
    createdAt: string;
    location?: string;
    skills: string[];
    experienceYears: number;
}

export interface Job {
    id: string;
    title: string;
    department: 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Product';
    location: string;
    type: 'Full-time' | 'Contract' | 'Remote';
    status: 'Open' | 'Closed' | 'Draft';
    applicantsCount: number;
    createdAt: string;
    description?: string;
    requirements?: string[];
}

export interface Application {
    id: string;
    candidateId: string;
    jobId: string;
    stage: string; // Specific pipeline stage
    appliedAt: string;
}

export interface MockData {
    candidates: Candidate[];
    jobs: Job[];
}
