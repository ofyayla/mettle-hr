import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface RecruitmentSegment {
    label: string;
    value: number;
    color: string;
    width: string;
}

export interface RecruitmentStat {
    label: string;
    value: number | string;
    trend?: {
        value: string;
        label: string;
        isPositive: boolean;
    };
}

export interface RecruitmentInsight {
    text: string;
    highlight: string;
}

export interface RecruitmentStatusCardProps {
    stats: RecruitmentStat[];
    segments: RecruitmentSegment[];
    insight: RecruitmentInsight;
    className?: string;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const RecruitmentStatusCard: React.FC<RecruitmentStatusCardProps> = ({
    stats,
    segments,
    insight,
    className,
}) => {
    return (
        <div
            className={cn(
                "w-full bg-card rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col h-full min-h-0 hover-neon-border group",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-sm">Recruitment Status</h3>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="flex w-full mb-auto">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex flex-col relative",
                            stat.label === 'Interviewed' && "mt-20 pl-6"
                        )}
                        style={{ width: index === 0 ? segments[0]?.width : 'auto' }}
                    >
                        <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                        <span className="text-3xl font-bold text-foreground mt-1">{stat.value}</span>
                        {stat.trend && (
                            <div className="mt-2">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
                                        stat.trend.isPositive
                                            ? "bg-positive/10 dark:bg-positive/20 text-positive"
                                            : "bg-negative/10 dark:bg-negative/20 text-negative"
                                    )}
                                >
                                    {stat.trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                    <span>{stat.trend.value}</span>
                                    <span className="font-normal text-muted-foreground ml-1">
                                        {stat.trend.label}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Label Info - Optional, helpful for context if tooltip isn't enough */}
            <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
                {/* Could add legend here if needed, but per spec sticking to valid minimal design */}
            </div>

            {/* Multi-Segment Progress Bar */}
            <div className="relative mt-2">
                <div className="flex h-3 w-full bg-muted/50 dark:bg-muted/30 rounded-full relative z-10 text-xs"> {/* Removed overflow-hidden, kept rounded-full on container */}
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-full transition-all duration-300 relative group",
                                index === 0 && "rounded-l-full", // Round first segment left
                                index === segments.length - 1 && "rounded-r-full", // Round last segment right
                                segment.color.startsWith('bg-') ? segment.color : `bg-[${segment.color}]`
                            )}
                            style={{ width: segment.width }}
                        >
                            {/* Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-popover text-popover-foreground border border-border rounded text-xs whitespace-nowrap shadow-lg pointer-events-none transition-opacity z-20">
                                <div className="font-bold">{segment.value}</div>
                                <div className="font-normal text-muted-foreground">{segment.label}</div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover border-t-border"></div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Vertical Divider Line */}
                <div
                    className="absolute bottom-3 w-px h-24 bg-border -translate-x-1/2 z-0"
                    style={{ left: segments[0]?.width }}
                />
            </div>

            {/* Segments Legend (Optional based on design, but helps UX) or just rely on Tooltips */}
            {/* Spec didn't ask for a legend, but the tooltip is requested. The tooltips are inside the loop above. */}


            {/* Insight Footer */}
            <div className="mt-6 pt-0">
                <div className="border-l-[3px] border-primary pl-4 py-1">
                    <p className="text-sm text-muted-foreground leading-snug">
                        {insight.text} <span className="font-semibold text-foreground">{insight.highlight}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentStatusCard;
