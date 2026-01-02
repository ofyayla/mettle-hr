import { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Linkedin, ArrowLeft, Calendar, Trash2, Pencil } from 'lucide-react';
import { Candidate } from '@/types';
import { cn } from '@/lib/utils';
import { CandidateProfileTab } from './tabs/CandidateProfileTab';
import { AIInsightsTab } from './tabs/AIInsightsTab';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { CANDIDATE_STATUS_STYLES } from '@/constants/candidate';

interface CandidateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
    jobTitle?: string;
    onDelete?: (candidate: Candidate) => void;
    onEdit?: (candidate: Candidate) => void;
    onUpdate?: (candidate: Candidate) => void;
}

export function CandidateProfileModal({ isOpen, onClose, candidate, jobTitle, onDelete, onEdit, onUpdate }: CandidateProfileModalProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'insights'>('profile');
    const [isResumeDeleteModalOpen, setIsResumeDeleteModalOpen] = useState(false);
    const [isResumeDeleted, setIsResumeDeleted] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab('profile');
            setIsResumeDeleteModalOpen(false);
            setIsResumeDeleted(false);
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        if (isOpen) {
            const handleKeyDown = (e: KeyboardEvent) => {
                // Only close main modal if delete modal is NOT open
                if (e.key === 'Escape' && !isResumeDeleteModalOpen) {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose, isResumeDeleteModalOpen]);

    const confirmDeleteResume = () => {
        setIsResumeDeleteModalOpen(false);
        setIsResumeDeleted(true);
        // Persist the change
        if (onUpdate && candidate) {
            onUpdate({ ...candidate, resumeUrl: undefined });
        }
    };

    if (!isOpen || !candidate) return null;

    // Create a display candidate that respects the deleted state
    const displayCandidate = isResumeDeleted ? { ...candidate, resumeUrl: undefined } : candidate;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

                <div className="relative w-full max-w-6xl h-[90vh] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">

                    {/* Close Button Mobile */}
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 md:hidden p-2 bg-background/50 rounded-full">
                        <X className="w-5 h-5" />
                    </button>

                    {/* LEFT SIDEBAR */}
                    <div className="w-full md:w-[320px] bg-card border-r border-border p-6 flex flex-col h-full overflow-y-auto shrink-0 relative">
                        {/* Back Button (Visual only) */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 cursor-pointer hover:text-foreground transition-colors" onClick={onClose}>
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to List</span>
                        </div>

                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-background shadow-lg overflow-hidden mb-4 relative z-10">
                                {candidate.photoUrl ? (
                                    <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                        {candidate.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-foreground">{candidate.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{candidate.role}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{candidate.experienceYears} Years Experience</p>
                        </div>


                        <div className="flex gap-2 w-full mb-8">
                            <button className="flex-1 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Interview
                            </button>
                            <button
                                onClick={() => window.location.href = `mailto:${candidate.email}`}
                                className="flex-1 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <Mail className="w-3.5 h-3.5" /> Email
                            </button>
                        </div>

                        {/* Job Match Score */}
                        <div className="bg-muted/30 rounded-2xl p-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    {/* SVG Circle */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/20" />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={125.6}
                                            strokeDashoffset={125.6 - (125.6 * candidate.score) / 100}
                                            className="text-emerald-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground">Job Match</div>
                                    <div className="text-xs text-emerald-600 font-bold">{candidate.score}% Profile Matched</div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {candidate.tags && candidate.tags.length > 0 ? (
                                    candidate.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-muted rounded-md text-[10px] font-medium text-muted-foreground border border-border/50">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    ['React', 'TypeScript', 'Node.js'].map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-muted rounded-md text-[10px] font-medium text-muted-foreground border border-border/50">
                                            {tag}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mt-auto">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-[10px] text-muted-foreground uppercase">Email</div>
                                        <div className="text-xs font-medium truncate" title={candidate.email}>{candidate.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted-foreground uppercase">Phone</div>
                                        <div className="text-xs font-medium">{candidate.phone || "+1 123 456 789"}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted-foreground uppercase">Address</div>
                                        <div className="text-xs font-medium">{candidate.location || "New York, NY"}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted-foreground uppercase">LinkedIn</div>
                                        <a
                                            href={`https://linkedin.com/in/${candidate.name.replace(/\s+/g, '').toLowerCase()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-medium text-blue-500 cursor-pointer hover:underline"
                                        >
                                            linkedin.com/in/{candidate.name.replace(/\s+/g, '').toLowerCase()}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border sticky bottom-0 bg-card z-10 flex gap-3">
                            <button
                                onClick={() => onEdit?.(candidate)}
                                className="flex-1 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Edit
                            </button>
                            <button
                                onClick={() => onDelete?.(candidate)}
                                className="flex-1 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 flex flex-col min-h-0 bg-background/50">
                        {/* Header / Tabs */}
                        <div className="px-8 pt-8 pb-4 border-b border-border bg-background sticky top-0 z-20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-muted-foreground">Application for <span className="text-foreground font-bold">{jobTitle || candidate.role}</span></h2>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-1 bg-muted/30 p-1 rounded-xl w-fit">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                            activeTab === 'profile'
                                                ? "bg-emerald-500/10 text-emerald-600 shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        Candidate Profile
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('insights')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                            activeTab === 'insights'
                                                ? "bg-emerald-500/10 text-emerald-600 shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        AI Insights
                                    </button>
                                </div>

                                <span className={cn("px-4 py-1.5 rounded-full text-sm font-medium border", CANDIDATE_STATUS_STYLES[candidate.status] || "bg-muted text-muted-foreground")}>
                                    {candidate.status}
                                </span>
                            </div>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {activeTab === 'profile' ? (
                                <CandidateProfileTab
                                    candidate={displayCandidate}
                                    onPreviewResume={() => {
                                        if (displayCandidate.resumeUrl) {
                                            window.open(displayCandidate.resumeUrl, '_blank');
                                        } else {
                                            alert('No resume URL available');
                                        }
                                    }}
                                    onDeleteResume={() => setIsResumeDeleteModalOpen(true)}
                                />
                            ) : (
                                <AIInsightsTab candidate={displayCandidate} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isResumeDeleteModalOpen}
                onClose={() => setIsResumeDeleteModalOpen(false)}
                onConfirm={confirmDeleteResume}
                title="Delete Resume"
                description={`Are you sure you want to delete the resume for ${candidate.name}? This action cannot be undone.`}
            />
        </>
    );
}
