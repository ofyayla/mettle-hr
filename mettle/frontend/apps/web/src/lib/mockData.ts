import { Candidate, Job, MockData } from '../types';

export const mockCandidates: Candidate[] = [
    {
        id: 'c1',
        name: 'Ali Yılmaz',
        email: 'ali.yilmaz@example.com',
        role: 'Senior React Developer',
        source: 'LinkedIn',
        status: 'New',
        score: 85,
        tags: ['Gelecek Vadeden', 'React Expert'],
        createdAt: '2023-10-25T10:00:00Z',
        skills: ['React', 'TypeScript', 'Node.js', 'Tailwind'],
        experienceYears: 5,
        photoUrl: 'https://i.pravatar.cc/150?u=ali'
    },
    {
        id: 'c2',
        name: 'Ayşe Demir',
        email: 'ayse.demir@example.com',
        role: 'Product Manager',
        source: 'CareerPage',
        status: 'Screening',
        score: 92,
        tags: ['Strong Leadership'],
        createdAt: '2023-10-24T14:30:00Z',
        skills: ['Product Management', 'Agile', 'Jira', 'User Research'],
        experienceYears: 7,
        photoUrl: 'https://i.pravatar.cc/150?u=ayse'
    },
    {
        id: 'c3',
        name: 'Mehmet Kaya',
        email: 'mehmet.kaya@example.com',
        role: 'Backend Developer',
        source: 'GitHub',
        status: 'Interview',
        score: 78,
        tags: ['Python', 'Django'],
        createdAt: '2023-10-20T09:15:00Z',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        experienceYears: 4,
        photoUrl: 'https://i.pravatar.cc/150?u=mehmet'
    },
    {
        id: 'c4',
        name: 'Zeynep Çelik',
        email: 'zeynep.celik@example.com',
        role: 'UX Designer',
        source: 'Referral',
        status: 'Offer',
        score: 88,
        tags: ['Figma', 'Creative'],
        createdAt: '2023-10-18T11:45:00Z',
        skills: ['Figma', 'UI/UX', 'Prototyping', 'Adobe XD'],
        experienceYears: 6,
        photoUrl: 'https://i.pravatar.cc/150?u=zeynep'
    },
    {
        id: 'c5',
        name: 'Can Vural',
        email: 'can.vural@example.com',
        role: 'DevOps Engineer',
        source: 'Indeed',
        status: 'Rejected',
        score: 65,
        tags: ['Junior'],
        createdAt: '2023-10-26T16:20:00Z',
        skills: ['AWS', 'Jenkins', 'Terraform'],
        experienceYears: 2,
        photoUrl: 'https://i.pravatar.cc/150?u=can'
    }
];

export const mockJobs: Job[] = [
    {
        id: 'j1',
        title: 'Senior React Developer',
        department: 'Engineering',
        location: 'Istanbul (Hybrid)',
        type: 'Full-time',
        status: 'Open',
        applicantsCount: 124,
        createdAt: '2023-10-01T09:00:00Z'
    },
    {
        id: 'j2',
        title: 'Product Manager',
        department: 'Product',
        location: 'Remote',
        type: 'Full-time',
        status: 'Open',
        applicantsCount: 45,
        createdAt: '2023-10-05T10:00:00Z'
    },
    {
        id: 'j3',
        title: 'Marketing Specialist',
        department: 'Marketing',
        location: 'Istanbul',
        type: 'Contract',
        status: 'Draft',
        applicantsCount: 0,
        createdAt: '2023-10-27T14:00:00Z'
    }
];

export const mockData: MockData = {
    candidates: mockCandidates,
    jobs: mockJobs
};
