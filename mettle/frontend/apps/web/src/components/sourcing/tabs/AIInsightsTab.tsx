import { Candidate } from '@/types';
import { ShieldCheck, Phone, Video } from 'lucide-react';

interface AIInsightsTabProps {
    candidate: Candidate;
}

export function AIInsightsTab({ candidate }: AIInsightsTabProps) {
    // Mock Data for visualization based on the reference image
    const insights = [
        {
            type: 'SMS Screening Insight',
            icon: ShieldCheck,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500',
            score: 85,
            description: "Clear and concise communication, demonstrating a strong understanding of the job role and responsibilities. Provides thoughtful, well-structured responses that reflect a deep grasp of the position's requirements and expectations."
        },
        {
            type: 'Call Screening Insight',
            icon: Phone,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500',
            score: 50,
            description: "Displays moderate confidence with a reasonable understanding of the role. However, there is a need to elaborate more on answers to showcase deeper knowledge and critical thinking. Providing more detailed explanations and specific examples would strengthen responses and better demonstrate expertise in the subject matter."
        },
        {
            type: 'Video Screening Insight',
            icon: Video,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500',
            score: 92,
            description: "Demonstrates strong confidence and presents themselves in a professional and composed manner. Exhibits excellent communication skills, articulating ideas clearly and effectively. Engages thoughtfully in conversation, with well-structured responses that reflect both clarity and depth of understanding."
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((item, index) => (
                    <div key={index} className="bg-card border border-border p-4 rounded-xl flex flex-col items-center shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 ${item.bgColor.replace('text', 'bg').replace('500', '100')} opacity-30`}></div>

                        <div className="flex items-center gap-2 mb-4 w-full justify-center">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            <span className="font-semibold text-xs text-foreground uppercase tracking-wide">{item.type}</span>
                        </div>

                        {/* Circular Progress (CSS-only for simplicity) */}
                        <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
                            {/* Background Circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-muted/20"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * item.score) / 100}
                                    className={`${item.color} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex items-center text-sm font-bold">
                                {item.score}<span className="text-muted-foreground font-normal">/100</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Insights Summary */}
            <section>
                <h3 className="text-lg font-bold text-foreground mb-6">AI Insights Summary</h3>
                <div className="space-y-6">
                    {insights.map((item, index) => (
                        <div key={index}>
                            <div className="flex items-center gap-2 mb-2">
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                                <h4 className="font-semibold text-sm">{item.type}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
