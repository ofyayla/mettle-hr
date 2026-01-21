import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '../JobCard';
import { Job } from '@/types';

// Mock job for testing
const mockJob: Job = {
    id: 'job-001',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'Open',
    applicantsCount: 15,
    createdAt: new Date('2025-01-10').toISOString(),
    description: 'We are looking for a senior engineer...',
    requirements: ['React', 'TypeScript', '5+ years experience']
};

describe('JobCard', () => {
    const mockOnEdit = vi.fn();
    const mockOnView = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders job title', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);
        expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('renders job department', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);
        expect(screen.getByText('Engineering')).toBeInTheDocument();
    });

    it('renders job location', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);
        expect(screen.getByText('Remote')).toBeInTheDocument();
    });

    it('renders job status', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('renders applicants count', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('calls onView when card is clicked', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);

        const card = screen.getByText('Senior Software Engineer').closest('div[class*="group"]');
        if (card) fireEvent.click(card);

        expect(mockOnView).toHaveBeenCalledWith(mockJob);
    });

    it('calls onEdit when edit button is clicked', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);

        // First button in the actions group is edit
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);

        expect(mockOnEdit).toHaveBeenCalledWith(mockJob);
    });

    it('calls onDelete when delete button is clicked', () => {
        render(<JobCard job={mockJob} onEdit={mockOnEdit} onView={mockOnView} onDelete={mockOnDelete} />);

        // Second button in actions is delete
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[1]);

        expect(mockOnDelete).toHaveBeenCalledWith(mockJob.id);
    });
});
