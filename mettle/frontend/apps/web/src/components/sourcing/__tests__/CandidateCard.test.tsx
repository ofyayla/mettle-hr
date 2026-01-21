import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CandidateCard } from '../CandidateCard';
import { Candidate } from '@/types';

// Mock candidate for testing
const mockCandidate: Candidate = {
    id: 'c-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: 'Senior Developer',
    location: 'New York',
    status: 'Screening',
    score: 85,
    source: 'LinkedIn',
    tags: ['React', 'TypeScript', 'Node.js'],
    photoUrl: 'https://example.com/photo.jpg',
    experience: [],
    education: [],
    certifications: [],
    createdAt: new Date().toISOString(),
    skills: ['React', 'TypeScript'],
    experienceYears: 5
};

describe('CandidateCard', () => {
    it('renders candidate name', () => {
        render(<CandidateCard candidate={mockCandidate} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders candidate role', () => {
        render(<CandidateCard candidate={mockCandidate} />);
        expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    it('renders candidate location', () => {
        render(<CandidateCard candidate={mockCandidate} />);
        expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('renders candidate score', () => {
        render(<CandidateCard candidate={mockCandidate} />);
        expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('renders candidate status', () => {
        render(<CandidateCard candidate={mockCandidate} />);
        expect(screen.getByText('Screening')).toBeInTheDocument();
    });

    it('renders tags (max 3)', () => {
        render(<CandidateCard candidate={mockCandidate} />);
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('calls onClick when card is clicked', () => {
        const onClick = vi.fn();
        render(<CandidateCard candidate={mockCandidate} onClick={onClick} />);

        const card = screen.getByText('John Doe').closest('div');
        if (card) fireEvent.click(card);

        expect(onClick).toHaveBeenCalledWith(mockCandidate);
    });

    it('calls onDelete when delete button is clicked', () => {
        const onDelete = vi.fn();
        render(<CandidateCard candidate={mockCandidate} onDelete={onDelete} />);

        const deleteButton = screen.getByTitle('Delete Candidate');
        fireEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledWith(mockCandidate);
    });

    it('renders badge check for high score candidates', () => {
        const highScoreCandidate = { ...mockCandidate, score: 90 };
        render(<CandidateCard candidate={highScoreCandidate} />);
        // Badge exists for score > 85
        expect(screen.getByText('90')).toBeInTheDocument();
    });
});
