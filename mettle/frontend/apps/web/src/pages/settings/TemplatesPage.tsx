import { useState } from 'react';
import { Mail, Edit, Copy, Trash2 } from 'lucide-react';

const initialTemplates = [
    { id: '1', name: 'Interview Invitation', subject: 'Invitation to Interview at {{company}}', type: 'System' },
    { id: '2', name: 'Rejection Email', subject: 'Update on your application for {{job_title}}', type: 'System' },
    { id: '3', name: 'Offer Letter', subject: 'Job Offer: {{job_title}} at {{company}}', type: 'Custom' },
];

export function TemplatesPage() {
    const [templates] = useState(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Email Templates</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage automated email communications.
                    </p>
                </div>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                    Create Template
                </button>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-3">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedTemplate === template.id
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                    : 'border-input hover:border-primary/50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${template.type === 'System' ? 'bg-zinc-100 text-zinc-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {template.type}
                                </span>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Copy className="h-3 w-3 hover:text-foreground" />
                                </div>
                            </div>
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1 truncate">{template.subject}</p>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-2">
                    <div className="rounded-lg border border-input bg-card h-full min-h-[400px] flex flex-col">
                        <div className="p-4 border-b border-input flex items-center justify-between bg-muted/30">
                            <h4 className="font-medium text-sm">Template Editor</h4>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-accent rounded-md">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                                <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-md">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Subject Line</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    defaultValue="Invitation to Interview at {{company}}"
                                />
                            </div>
                            <div className="grid gap-2 h-full">
                                <label className="text-sm font-medium">Content</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[200px] font-mono text-xs leading-relaxed"
                                    defaultValue={`Hi {{candidate_name}},\n\nThank you for applying to the {{job_title}} position at {{company}}.\n\nWe would like to invite you to an interview.\n\nBest,\n{{recruiter_name}}`}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Available variables: <code>{'{{candidate_name}}'}</code>, <code>{'{{job_title}}'}</code>, <code>{'{{company}}'}</code>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
