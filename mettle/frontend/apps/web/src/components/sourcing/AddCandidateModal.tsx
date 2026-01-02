import { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, Trash2, User, Briefcase, GraduationCap, Award, FileText, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Candidate, Job } from '@/types';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (candidate: any) => void;
    initialData?: Candidate;
    jobs?: Job[];
}

// Extended types for local state since global types might be simpler
interface WorkExperience {
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

interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    grade: string;
    activities: string;
}

interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate: string;
    credentialId: string;
}

export function AddCandidateModal({ isOpen, onClose, onSave, initialData, jobs = [] }: AddCandidateModalProps) {
    // Basic Info State
    const [basicInfo, setBasicInfo] = useState<{
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
    }>({
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
            // Reset form when opening in "Add" mode
            setBasicInfo({
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
            setSkills('');
            setSummary('');
            setExperience([]);
            setEducation([]);
            setCertifications([]);
        }
    }, [initialData, isOpen]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);

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

    const [resumeFile, setResumeFile] = useState<File | null>(null);

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
                setSummary('Experienced Frontend Engineer with 5+ years of expertise in React, TypeScript, and modern web technologies. Passionate about building scalable and user-friendly applications.');
                setSkills('React, TypeScript, Next.js, TailwindCSS, Node.js, GraphQL, AWS');

                setExperience([
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        title: 'Senior Frontend Developer',
                        company: 'Tech Solutions Inc.',
                        type: 'Full-time',
                        location: 'San Francisco, CA',
                        startDate: 'Jan 2021',
                        endDate: 'Present',
                        current: true,
                        description: 'Led the frontend team in rebuilding the core product using Next.js and TailwindCSS. Improved performance by 40%.'
                    },
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        title: 'Frontend Developer',
                        company: 'WebCorp',
                        type: 'Full-time',
                        location: 'Austin, TX',
                        startDate: 'Jun 2018',
                        endDate: 'Dec 2020',
                        current: false,
                        description: 'Developed and maintained multiple client-facing web applications using React and Redux.'
                    }
                ]);

                setEducation([
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        school: 'University of California, Berkeley',
                        degree: 'BS Computer Science',
                        field: 'Computer Science',
                        startDate: '2014',
                        endDate: '2018',
                        grade: '3.8 GPA',
                        activities: 'Coding Club President'
                    }
                ]);

                setIsParsing(false);
            }, 2000);
        }
    };

    const triggerPhotoUpload = () => {
        fileInputRef.current?.click();
    };

    const [summary, setSummary] = useState('');
    const [skills, setSkills] = useState(''); // Comma separated for simplicity

    // Dynamic Lists State
    const [experience, setExperience] = useState<WorkExperience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);

    // Collapsible Sections State
    const [sectionsOpen, setSectionsOpen] = useState({
        basic: true,
        summary: true,
        experience: true,
        education: true,
        certifications: true,
        documents: true
    });

    const toggleSection = (section: keyof typeof sectionsOpen) => {
        setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // --- Experience Handlers ---
    const addExperience = () => {
        setExperience([
            ...experience,
            {
                id: Math.random().toString(36).substr(2, 9),
                title: '',
                company: '',
                type: 'Full-time',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }
        ]);
    };

    const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
        setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const removeExperience = (id: string) => {
        setExperience(experience.filter(exp => exp.id !== id));
    };

    // --- Education Handlers ---
    const addEducation = () => {
        setEducation([
            ...education,
            {
                id: Math.random().toString(36).substr(2, 9),
                school: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                grade: '',
                activities: ''
            }
        ]);
    };

    const updateEducation = (id: string, field: keyof Education, value: any) => {
        setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const removeEducation = (id: string) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    // --- Certification Handlers ---
    const addCertification = () => {
        setCertifications([
            ...certifications,
            {
                id: Math.random().toString(36).substr(2, 9),
                name: '',
                issuer: '',
                issueDate: '',
                expirationDate: '',
                credentialId: ''
            }
        ]);
    };

    const updateCertification = (id: string, field: keyof Certification, value: any) => {
        setCertifications(certifications.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
    };

    const removeCertification = (id: string) => {
        setCertifications(certifications.filter(cert => cert.id !== id));
    };

    // --- Save Handler ---
    const handleSave = () => {
        const fullCandidateData = {
            ...basicInfo,
            summary,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            experience,
            education,
            certifications
        };
        console.log('Saving Candidate:', fullCandidateData);
        onSave?.(fullCandidateData);
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-border flex flex-col h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-background z-10">
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{initialData ? 'Edit Candidate' : 'Add New Candidate'}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{initialData ? 'Update candidate information below.' : 'Enter detailed information about the candidate.'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Resume Upload Section */}
                    {!initialData && (
                        <div className="bg-primary/5 rounded-xl border border-dashed border-primary/30 p-8 text-center relative overflow-hidden group">
                            <input
                                type="file"
                                ref={resumeInputRef}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setResumeFile(null);
                                            // Optional: Clear form data if needed
                                        }}
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
                                    <div className="bg-background w-12 h-12 mx-auto rounded-full border border-border shadow-sm flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-md transition-all">
                                        <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Upload Resume / CV
                                        </h3>
                                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                                            Drag & drop or click to upload. <br />
                                            <span className="text-primary font-medium inline-flex items-center gap-1 mt-1">
                                                <Sparkles className="w-3 h-3" />
                                                Auto-fill with AI
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <span className="text-[10px] font-medium px-2 py-1 rounded bg-background border border-border">PDF</span>
                                        <span className="text-[10px] font-medium px-2 py-1 rounded bg-background border border-border">DOCX</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Section 1: Personal Info */}
                    <div className="space-y-4">
                        <button onClick={() => toggleSection('basic')} className="flex items-center justify-between w-full group">
                            <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                <User className="w-5 h-5" /> Personal Information
                            </h3>
                            {sectionsOpen.basic ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </button>

                        {sectionsOpen.basic && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                                {/* Photo Upload */}
                                <div className="col-span-1 md:col-span-2 flex justify-center mb-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                    <div
                                        onClick={triggerPhotoUpload}
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


                                <div className="col-span-1 md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Assign to Job (Optional)</label>
                                    <div className="relative">
                                        <select
                                            value={basicInfo.appliedJobId}
                                            onChange={e => {
                                                const jobId = e.target.value;
                                                const job = jobs.find(j => j.id === jobId);
                                                setBasicInfo({
                                                    ...basicInfo,
                                                    appliedJobId: jobId
                                                });
                                            }}
                                            className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm appearance-none"
                                        >
                                            <option value="">Select a job posting...</option>
                                            {jobs.map(job => (
                                                <option key={job.id} value={job.id}>
                                                    {job.title} ({job.location})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">First Name</label>
                                    <input value={basicInfo.firstName} onChange={e => setBasicInfo({ ...basicInfo, firstName: e.target.value })} type="text" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="John" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Last Name</label>
                                    <input value={basicInfo.lastName} onChange={e => setBasicInfo({ ...basicInfo, lastName: e.target.value })} type="text" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="Doe" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Email</label>
                                    <input value={basicInfo.email} onChange={e => setBasicInfo({ ...basicInfo, email: e.target.value })} type="email" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="john.doe@example.com" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Phone</label>
                                    <input value={basicInfo.phone} onChange={e => setBasicInfo({ ...basicInfo, phone: e.target.value })} type="tel" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="+1 234 567 8900" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Role / Title</label>
                                    <input value={basicInfo.role} onChange={e => setBasicInfo({ ...basicInfo, role: e.target.value })} type="text" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="e.g. Senior Product Designer" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Location</label>
                                    <input value={basicInfo.location} onChange={e => setBasicInfo({ ...basicInfo, location: e.target.value })} type="text" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="New York, NY" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border/50" />

                    {/* Section 2: Summary & Skills */}
                    <div className="space-y-4">
                        <button onClick={() => toggleSection('summary')} className="flex items-center justify-between w-full group">
                            <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                <FileText className="w-5 h-5" /> Professional Summary
                            </h3>
                            {sectionsOpen.summary ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </button>

                        {sectionsOpen.summary && (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Bio / Cover Letter</label>
                                    <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={4} className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm resize-none" placeholder="Brief summary about the candidate..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Skills (Comma Separated)</label>
                                    <input value={skills} onChange={e => setSkills(e.target.value)} type="text" className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm" placeholder="React, TypeScript, Figma, Node.js" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border/50" />

                    {/* Section 3: Work Experience */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <button onClick={() => toggleSection('experience')} className="flex items-center gap-2 group">
                                <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <Briefcase className="w-5 h-5" /> Work Experience
                                </h3>
                                {sectionsOpen.experience ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </button>
                            <button onClick={addExperience} size="sm" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium px-2 py-1 bg-primary/10 rounded-lg transition-colors">
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>

                        {sectionsOpen.experience && (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                                {experience.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No work experience added yet.</p>
                                )}
                                {experience.map((exp, index) => (
                                    <div key={exp.id} className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4 relative group">
                                        <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4 mr-8">
                                            <div className="space-y-1">
                                                <input value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm font-semibold placeholder:font-normal focus:border-primary/50 outline-none" placeholder="Job Title" />
                                            </div>
                                            <div className="space-y-1">
                                                <input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 outline-none" placeholder="Company" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="Start Date (e.g. Jan 2020)" />
                                            <input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="End Date (or Present)" />
                                            <input value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="Location" />
                                        </div>
                                        <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none resize-none" placeholder="Job description..." />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border/50" />

                    {/* Section 4: Education */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <button onClick={() => toggleSection('education')} className="flex items-center gap-2 group">
                                <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <GraduationCap className="w-5 h-5" /> Education
                                </h3>
                                {sectionsOpen.education ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </button>
                            <button onClick={addEducation} size="sm" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium px-2 py-1 bg-primary/10 rounded-lg transition-colors">
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>

                        {sectionsOpen.education && (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                                {education.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No education added yet.</p>
                                )}
                                {education.map((edu, index) => (
                                    <div key={edu.id} className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4 relative group">
                                        <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4 mr-8">
                                            <input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm font-semibold placeholder:font-normal focus:border-primary/50 outline-none" placeholder="School / University" />
                                            <input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 outline-none" placeholder="Degree (e.g. BS Computer Science)" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="Start Date" />
                                            <input value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="End Date" />
                                            <input value={edu.activities} onChange={e => updateEducation(edu.id, 'activities', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="Activities / Grade" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border/50" />

                    {/* Section 5: Certifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <button onClick={() => toggleSection('certifications')} className="flex items-center gap-2 group">
                                <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <Award className="w-5 h-5" /> Certifications
                                </h3>
                                {sectionsOpen.certifications ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </button>
                            <button onClick={addCertification} size="sm" className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium px-2 py-1 bg-primary/10 rounded-lg transition-colors">
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>

                        {sectionsOpen.certifications && (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                                {certifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No certifications added yet.</p>
                                )}
                                {certifications.map((cert, index) => (
                                    <div key={cert.id} className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4 relative group">
                                        <button onClick={() => removeCertification(cert.id)} className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4 mr-8">
                                            <input value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm font-semibold placeholder:font-normal focus:border-primary/50 outline-none" placeholder="Certification Name" />
                                            <input value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 outline-none" placeholder="Issuing Organization" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={cert.issueDate} onChange={e => updateCertification(cert.id, 'issueDate', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="Issue Date" />
                                            <input value={cert.credentialId} onChange={e => updateCertification(cert.id, 'credentialId', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-xs focus:border-primary/50 outline-none" placeholder="Credential ID" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
