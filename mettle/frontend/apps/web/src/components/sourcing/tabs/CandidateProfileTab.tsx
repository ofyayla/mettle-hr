import { Candidate } from '@/types';
import { FileText, Download, Eye, Briefcase, GraduationCap, Award, Trash2 } from 'lucide-react';

interface CandidateProfileTabProps {
    candidate: Candidate;
    onDeleteResume?: () => void;
    onPreviewResume?: () => void;
}

export function CandidateProfileTab({ candidate, onDeleteResume, onPreviewResume }: CandidateProfileTabProps) {
    return (
        <div className="space-y-10 animate-in fade-in duration-300">
            {/* Personal Details */}
            <section>
                <h3 className="text-lg font-bold text-foreground mb-4">Personal Details</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">First Name</div>
                        <div className="text-sm font-medium">{candidate.name.split(' ')[0]}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Email</div>
                        <div className="text-sm font-medium">{candidate.email}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Last Name</div>
                        <div className="text-sm font-medium">{candidate.name.split(' ').slice(1).join(' ')}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="text-sm font-medium">{candidate.role}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Gender</div>
                        <div className="text-sm font-medium">Male</div> {/* Mocked data */}
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Date of Birth</div>
                        <div className="text-sm font-medium">March 23, 1995 (29 Yrs old)</div> {/* Mocked data */}
                    </div>
                </div>
            </section>

            {/* Cover Letter */}
            <section>
                <h3 className="text-lg font-bold text-foreground mb-3">Cover Letter</h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac elementum justo. Pellentesque dapibus tellus nunc, id ultricies
                        mauris vulputate et. Donec scelerisque iaculis mattis. Curabitur mollis augue eu tortor laoreet vulputate. Mauris tincidunt, mauris sit
                        amet maximus porttitor, eros arcu mollis mi, a placerat nisi libero vitae velit.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac elementum justo. Pellentesque dapibus tellus nunc, id ultricies
                        mauris vulputate et. Donec scelerisque iaculis mattis. See more...
                    </p>
                </div>
            </section>

            {/* Experience & Education - Full Width Stacked */}
            <div className="space-y-10">
                {/* Experience Section */}
                <section>
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        Experience
                    </h3>
                    <div className="space-y-6">
                        {/* Experience Item 1 */}
                        <div className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Briefcase className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Senior Product Designer</h4>
                                <div className="text-sm font-medium text-foreground/80">Google • Full-time</div>
                                <div className="text-xs text-muted-foreground mt-0.5 mb-2">Aug 2023 - Present • 1 yr 8 mos</div>
                                <div className="text-xs text-muted-foreground">New York, NY</div>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                    Leading the design system team for Cloud products. Collaborating with cross-functional teams to define design standards and best practices. Mentoring junior designers and conducting design reviews.
                                </p>
                                <div className="flex gap-2 mt-3 text-xs">
                                    <span className="font-semibold text-foreground/70">Skills:</span>
                                    <span className="text-muted-foreground">Design Systems • Figma • Prototyping</span>
                                </div>
                            </div>
                        </div>

                        {/* Experience Item 2 */}
                        <div className="border-t border-border/40 my-4" /> {/* Separator */}

                        <div className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Briefcase className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Product Designer</h4>
                                <div className="text-sm font-medium text-foreground/80">Spotify • Contract</div>
                                <div className="text-xs text-muted-foreground mt-0.5 mb-2">Jan 2020 - Jul 2023 • 3 yrs 7 mos</div>
                                <div className="text-xs text-muted-foreground">Stockholm, Sweden</div>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                    Worked on the core player experience. Improved user engagement by 15% through iterative design and A/B testing.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Education Section */}
                <section>
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        Education
                    </h3>
                    <div className="space-y-6">
                        {/* Education Item 1 */}
                        <div className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Stanford University</h4>
                                <div className="text-sm font-medium text-foreground/80">Master's degree, Human Computer Interaction</div>
                                <div className="text-xs text-muted-foreground mt-0.5 mb-2">2016 - 2018</div>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                    Relevant Coursework: User-Centered Research, Interaction Design Studio, Social Computing.
                                </p>
                                <div className="text-xs text-muted-foreground mt-1">Activities: UX Club President</div>
                            </div>
                        </div>

                        {/* Education Item 2 */}
                        <div className="border-t border-border/40 my-4" /> {/* Separator */}

                        <div className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">University of California, Berkeley</h4>
                                <div className="text-sm font-medium text-foreground/80">Bachelor's degree, Computer Science</div>
                                <div className="text-xs text-muted-foreground mt-0.5 mb-2">2012 - 2016</div>
                                <div className="text-xs text-muted-foreground mt-1">Grade: 3.8 GPA</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Certifications - New Section */}
            <section className="mb-10">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    Certifications
                </h3>
                <div className="space-y-6">
                    {/* Certification Item 1 */}
                    <div className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">AWS Certified Solutions Architect</h4>
                            <div className="text-sm font-medium text-foreground/80">Amazon Web Services (AWS)</div>
                            <div className="text-xs text-muted-foreground mt-0.5 mb-2">Issued Jan 2023 • Expires Jan 2026</div>
                            <div className="text-xs text-muted-foreground mt-1">Credential ID: AWS-12345678</div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-border/40 my-4" />

                    {/* Certification Item 2 */}
                    <div className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Professional Scrum Master I (PSM I)</h4>
                            <div className="text-sm font-medium text-foreground/80">Scrum.org</div>
                            <div className="text-xs text-muted-foreground mt-0.5 mb-2">Issued Jun 2022 • No Expiration Date</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resume */}
            <section className="pt-4 border-t border-border/50">
                <h3 className="text-lg font-bold text-foreground mb-4">Resume</h3>
                {candidate.resumeUrl ? (
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm">{candidate.name.replace(/\s+/g, '_')}_Resume.pdf</div>
                                <div className="text-xs text-muted-foreground">PDF Document</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onPreviewResume}
                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="Preview"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onDeleteResume}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"
                                title="Delete Resume"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-xl border border-dashed border-border text-center">
                        No resume uploaded.
                    </div>
                )}
            </section>
        </div>
    );
}
