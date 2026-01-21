import { useState, useEffect, useRef } from 'react';
import { X, Upload, User, Briefcase, GraduationCap, Award, FileText, ChevronDown, Sparkles, Trash2 } from 'lucide-react';
import { Candidate, Job } from '@/types';
import {
    WorkExperience,
    Education,
    Certification,
    CandidateBasicInfo,
    createEmptyBasicInfo,
    createEmptyExperience,
    createEmptyEducation,
    createEmptyCertification
} from '@/types/candidate-form';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { ExperienceItem, EducationItem, CertificationItem } from './candidate-form';
import { useModalKeyboard } from '@/hooks';
import toast from 'react-hot-toast';

// Candidate save data type
interface CandidateSaveData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    location?: string;
    photoUrl?: string;
    appliedJobId?: string;
    summary?: string;
    skills: string[];
    experience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
}

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (candidate: CandidateSaveData) => void;
    initialData?: Candidate;
    jobs?: Job[];
}

export function AddCandidateModal({ isOpen, onClose, onSave, initialData, jobs = [] }: AddCandidateModalProps) {
    // Form state
    const [basicInfo, setBasicInfo] = useState<CandidateBasicInfo>(createEmptyBasicInfo());
    const [summary, setSummary] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState<WorkExperience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);

    // UI state
    const [sectionsOpen, setSectionsOpen] = useState({
        basic: true,
        summary: true,
        experience: true,
        education: true,
        certifications: true
    });
    const [isParsing, setIsParsing] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    // Use custom hook for ESC key
    useModalKeyboard(isOpen, onClose);

    // Initialize form with data
    useEffect(() => {
        if (initialData) {
            const [firstName, ...lastNameParts] = initialData.name.split(' ');
            setBasicInfo({
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                role: initialData.role || '',
                location: initialData.location || '',
                gender: '',
                dob: '',
                linkedin: '',
                portfolio: '',
                photoUrl: initialData.photoUrl,
                appliedJobId: initialData.appliedJobId || ''
            });
            setSkills((initialData.tags || []).join(', '));
            setSummary(initialData.summary || '');
            setExperience(initialData.experience || []);
            setEducation(initialData.education || []);
            setCertifications(initialData.certifications || []);
        } else {
            // Reset form
            setBasicInfo(createEmptyBasicInfo());
            setSkills('');
            setSummary('');
            setExperience([]);
            setEducation([]);
            setCertifications([]);
        }
    }, [initialData, isOpen]);

    // Handlers
    const toggleSection = (section: keyof typeof sectionsOpen) => {
        setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBasicInfo(prev => ({ ...prev, photoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            setIsParsing(true);
            // Simulate AI parsing
            setTimeout(() => {
                setBasicInfo(prev => ({
                    ...prev,
                    firstName: 'Alex',
                    lastName: 'Morgan',
                    email: 'alex.morgan@example.com',
                    phone: '+1 (555) 123-4567',
                    role: 'Senior Frontend Engineer',
                    location: 'San Francisco, CA',
                    linkedin: 'linkedin.com/in/alexmorgan',
                    portfolio: 'alexmorgan.dev'
                }));
                setSummary('Experienced Frontend Engineer with 5+ years of expertise in React, TypeScript, and modern web technologies.');
                setSkills('React, TypeScript, Next.js, TailwindCSS, Node.js');
                setExperience([createEmptyExperience()]);
                setIsParsing(false);
            }, 2000);
        }
    };

    // Experience handlers
    const updateExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
        setExperience(prev => prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const removeExperience = (id: string) => {
        setExperience(prev => prev.filter(exp => exp.id !== id));
    };

    // Education handlers
    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setEducation(prev => prev.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const removeEducation = (id: string) => {
        setEducation(prev => prev.filter(edu => edu.id !== id));
    };

    // Certification handlers
    const updateCertification = (id: string, field: keyof Certification, value: string) => {
        setCertifications(prev => prev.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
    };

    const removeCertification = (id: string) => {
        setCertifications(prev => prev.filter(cert => cert.id !== id));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!basicInfo.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!basicInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!basicInfo.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicInfo.email)) {
            newErrors.email = 'Invalid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }
        const fullCandidateData = {
            ...basicInfo,
            summary,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            experience,
            education,
            certifications
        };
        onSave?.(fullCandidateData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            role="presentation"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="candidate-modal-title"
                aria-describedby="candidate-modal-description"
                className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-border flex flex-col h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-border bg-background z-10">
                    <div>
                        <h2 id="candidate-modal-title" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {initialData ? 'Edit Candidate' : 'Add New Candidate'}
                        </h2>
                        <p id="candidate-modal-description" className="text-sm text-muted-foreground mt-1">
                            {initialData ? 'Update candidate information below.' : 'Enter detailed information about the candidate.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Close modal">
                        <X className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Resume Upload */}
                    {!initialData && (
                        <ResumeUploadSection
                            resumeInputRef={resumeInputRef}
                            isParsing={isParsing}
                            resumeFile={resumeFile}
                            onUpload={handleResumeUpload}
                            onClear={() => setResumeFile(null)}
                        />
                    )}

                    {/* Personal Info Section */}
                    <CollapsibleSection
                        title="Personal Information"
                        icon={User}
                        isOpen={sectionsOpen.basic}
                        onToggle={() => toggleSection('basic')}
                    >
                        <PersonalInfoSection
                            basicInfo={basicInfo}
                            jobs={jobs}
                            onUpdate={setBasicInfo}
                            fileInputRef={fileInputRef}
                            onPhotoUpload={handlePhotoUpload}
                        />
                    </CollapsibleSection>

                    <div className="border-t border-border/50" />

                    {/* Summary & Skills */}
                    <CollapsibleSection
                        title="Professional Summary"
                        icon={FileText}
                        isOpen={sectionsOpen.summary}
                        onToggle={() => toggleSection('summary')}
                    >
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Bio / Cover Letter</label>
                                <textarea
                                    value={summary}
                                    onChange={e => setSummary(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm resize-none"
                                    placeholder="Brief summary about the candidate..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Skills (Comma Separated)</label>
                                <input
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    type="text"
                                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                                    placeholder="React, TypeScript, Figma, Node.js"
                                />
                            </div>
                        </div>
                    </CollapsibleSection>

                    <div className="border-t border-border/50" />

                    {/* Experience */}
                    <CollapsibleSection
                        title="Work Experience"
                        icon={Briefcase}
                        isOpen={sectionsOpen.experience}
                        onToggle={() => toggleSection('experience')}
                        onAdd={() => setExperience([...experience, createEmptyExperience()])}
                    >
                        {experience.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic text-center py-4">No work experience added yet.</p>
                        ) : (
                            experience.map(exp => (
                                <ExperienceItem
                                    key={exp.id}
                                    experience={exp}
                                    onUpdate={updateExperience}
                                    onRemove={removeExperience}
                                />
                            ))
                        )}
                    </CollapsibleSection>

                    <div className="border-t border-border/50" />

                    {/* Education */}
                    <CollapsibleSection
                        title="Education"
                        icon={GraduationCap}
                        isOpen={sectionsOpen.education}
                        onToggle={() => toggleSection('education')}
                        onAdd={() => setEducation([...education, createEmptyEducation()])}
                    >
                        {education.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic text-center py-4">No education added yet.</p>
                        ) : (
                            education.map(edu => (
                                <EducationItem
                                    key={edu.id}
                                    education={edu}
                                    onUpdate={updateEducation}
                                    onRemove={removeEducation}
                                />
                            ))
                        )}
                    </CollapsibleSection>

                    <div className="border-t border-border/50" />

                    {/* Certifications */}
                    <CollapsibleSection
                        title="Certifications"
                        icon={Award}
                        isOpen={sectionsOpen.certifications}
                        onToggle={() => toggleSection('certifications')}
                        onAdd={() => setCertifications([...certifications, createEmptyCertification()])}
                    >
                        {certifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic text-center py-4">No certifications added yet.</p>
                        ) : (
                            certifications.map(cert => (
                                <CertificationItem
                                    key={cert.id}
                                    certification={cert}
                                    onUpdate={updateCertification}
                                    onRemove={removeCertification}
                                />
                            ))
                        )}
                    </CollapsibleSection>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-background z-10 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-8 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95">
                        {initialData ? 'Save Changes' : 'Save Candidate'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-components

interface ResumeUploadSectionProps {
    resumeInputRef: React.RefObject<HTMLInputElement>;
    isParsing: boolean;
    resumeFile: File | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
}

function ResumeUploadSection({ resumeInputRef, isParsing, resumeFile, onUpload, onClear }: ResumeUploadSectionProps) {
    return (
        <div className="bg-primary/5 rounded-xl border border-dashed border-primary/30 p-8 text-center relative overflow-hidden group">
            <input
                type="file"
                ref={resumeInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={onUpload}
            />

            {isParsing ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="bg-primary/10 p-3 rounded-full relative">
                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-primary font-semibold text-sm">Analyzing Resume with AI...</p>
                        <p className="text-muted-foreground text-xs">Extracting contact info, experience, and skills</p>
                    </div>
                </div>
            ) : resumeFile ? (
                <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="bg-background p-2 rounded-lg border border-border">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{resumeFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClear(); }}
                        className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => resumeInputRef.current?.click()}
                    className="cursor-pointer space-y-3 hover:scale-[1.01] transition-transform duration-200"
                >
                    <div className="bg-background w-12 h-12 mx-auto rounded-full border border-border shadow-sm flex items-center justify-center">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">Upload Resume / CV</h3>
                        <p className="text-xs text-muted-foreground">
                            Drag & drop or click to upload.<br />
                            <span className="text-primary font-medium inline-flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3" /> Auto-fill with AI
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

interface PersonalInfoSectionProps {
    basicInfo: CandidateBasicInfo;
    jobs: Job[];
    onUpdate: (info: CandidateBasicInfo) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PersonalInfoSection({ basicInfo, jobs, onUpdate, fileInputRef, onPhotoUpload }: PersonalInfoSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            <div className="col-span-1 md:col-span-2 flex justify-center mb-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onPhotoUpload} />
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors group overflow-hidden relative"
                >
                    {basicInfo.photoUrl ? (
                        <img src={basicInfo.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto text-muted-foreground group-hover:text-primary mb-1" />
                            <span className="text-[10px] text-muted-foreground">Upload Photo</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Job Selection */}
            <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Assign to Job (Optional)</label>
                <div className="relative">
                    <select
                        value={basicInfo.appliedJobId}
                        onChange={e => onUpdate({ ...basicInfo, appliedJobId: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm appearance-none"
                    >
                        <option value="">Select a job posting...</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title} ({job.location})</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Name Fields */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">First Name</label>
                <input
                    value={basicInfo.firstName}
                    onChange={e => onUpdate({ ...basicInfo, firstName: e.target.value })}
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="John"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Last Name</label>
                <input
                    value={basicInfo.lastName}
                    onChange={e => onUpdate({ ...basicInfo, lastName: e.target.value })}
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="Doe"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Email</label>
                <input
                    value={basicInfo.email}
                    onChange={e => onUpdate({ ...basicInfo, email: e.target.value })}
                    type="email"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="john.doe@example.com"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Phone</label>
                <input
                    value={basicInfo.phone}
                    onChange={e => onUpdate({ ...basicInfo, phone: e.target.value })}
                    type="tel"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="+1 234 567 8900"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Role / Title</label>
                <input
                    value={basicInfo.role}
                    onChange={e => onUpdate({ ...basicInfo, role: e.target.value })}
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="e.g. Senior Product Designer"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Location</label>
                <input
                    value={basicInfo.location}
                    onChange={e => onUpdate({ ...basicInfo, location: e.target.value })}
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                    placeholder="New York, NY"
                />
            </div>
        </div>
    );
}
