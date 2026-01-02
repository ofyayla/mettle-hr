import { Candidate, Job, MockData } from '../types';

export const mockCandidates: Candidate[] = [
    {
        id: 'c1',
        name: 'Sarah Anderson',
        email: 'sarah.anderson@example.com',
        role: 'Senior React Developer',
        source: 'LinkedIn',
        status: 'New',
        score: 85,
        tags: ['Top Talent', 'React Expert'],
        createdAt: '2023-10-25T10:00:00Z',
        skills: ['React', 'TypeScript', 'Node.js', 'Tailwind'],
        experienceYears: 5,
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        location: 'San Francisco, CA',
        appliedJobId: 'j1',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Added mock resume URL
        summary: 'Experienced React Developer with a passion for building scalable web applications. Proven track record of delivering high-quality code and leading development teams.',
        experience: [
            {
                id: 'exp1',
                title: 'Senior Frontend Developer',
                company: 'Tech Corp',
                startDate: '2020-01',
                endDate: 'Present',
                location: 'San Francisco, CA',
                description: 'Leading the frontend team for the main product dashboard.'
            },
            {
                id: 'exp2',
                title: 'Frontend Developer',
                company: 'Startup Inc',
                startDate: '2018-03',
                endDate: '2019-12',
                location: 'Austin, TX',
                description: 'Developed key features for the MVP using React and Redux.'
            }
        ],
        education: [
            {
                id: 'edu1',
                school: 'University of California, Berkeley',
                degree: 'BS Computer Science',
                startDate: '2014',
                endDate: '2018',
                grade: '3.8 GPA'
            }
        ],
        certifications: [
            {
                id: 'cert1',
                name: 'AWS Certified Solutions Architect',
                issuer: 'Amazon Web Services',
                issueDate: '2022-05',
                credentialId: 'AWS-123456'
            }
        ]
    },
    {
        id: 'c2',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        role: 'Product Manager',
        source: 'CareerPage',
        status: 'Screening',
        score: 92,
        tags: ['Strong Leadership', 'Product Vision'],
        createdAt: '2023-10-24T14:30:00Z',
        skills: ['Product Management', 'Agile', 'Jira', 'User Research'],
        experienceYears: 7,
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        location: 'New York, NY',
        appliedJobId: 'j2',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // Added mock resume URL
    },
    {
        id: 'c3',
        name: 'David Kim',
        email: 'david.kim@example.com',
        role: 'Backend Developer',
        source: 'GitHub',
        status: 'Interview',
        score: 78,
        tags: ['Python Expert', 'Backend Architecture'],
        createdAt: '2023-10-20T09:15:00Z',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        experienceYears: 4,
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        location: 'Austin, TX',
        appliedJobId: 'j1'
    },
    {
        id: 'c4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'UX Designer',
        source: 'Referral',
        status: 'Offer',
        score: 88,
        tags: ['Creative', 'Design System'],
        createdAt: '2023-10-18T11:45:00Z',
        skills: ['Figma', 'UI/UX', 'Prototyping', 'Adobe XD'],
        experienceYears: 6,
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        location: 'London, UK',
        appliedJobId: 'j2',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // Added mock resume URL
    },
    {
        id: 'c5',
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        role: 'DevOps Engineer',
        source: 'Indeed',
        status: 'Rejected',
        score: 65,
        tags: ['Junior', 'AWS Certified'],
        createdAt: '2023-10-26T16:20:00Z',
        skills: ['AWS', 'Jenkins', 'Terraform'],
        experienceYears: 2,
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        location: 'Toronto, Canada',
        appliedJobId: 'j1'
    },
    {
        id: 'c6',
        name: 'Sophia Martinez',
        email: 'sophia.martinez@example.com',
        role: 'Marketing Specialist',
        source: 'LinkedIn',
        status: 'New',
        score: 72,
        tags: ['Social Media', 'Content Strategy'],
        createdAt: '2023-10-27T09:00:00Z',
        skills: ['SEO', 'Content Marketing', 'Google Analytics'],
        experienceYears: 3,
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        location: 'Miami, FL',
        appliedJobId: 'j3'
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
