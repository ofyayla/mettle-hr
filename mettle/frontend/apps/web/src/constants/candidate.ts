import { Candidate } from '@/types';

export const CANDIDATE_STATUS_STYLES: Record<Candidate['status'], string> = {
    'New': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Screening': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Interview': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Offer': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Hired': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const CANDIDATE_STATUS_LABELS: Record<Candidate['status'], string> = {
    'New': 'New',
    'Screening': 'Screening',
    'Interview': 'Interview',
    'Offer': 'Offer',
    'Hired': 'Hired',
    'Rejected': 'Rejected',
};

export const CANDIDATE_STATUS_COLORS: Record<Candidate['status'], string> = {
    'New': 'bg-blue-500',
    'Screening': 'bg-purple-500',
    'Interview': 'bg-orange-500',
    'Offer': 'bg-green-500',
    'Hired': 'bg-emerald-500',
    'Rejected': 'bg-red-500',
};
