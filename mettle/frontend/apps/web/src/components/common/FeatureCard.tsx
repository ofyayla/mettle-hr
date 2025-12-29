import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    to: string;
    icon: LucideIcon;
    title: string;
    description: string;
    gradientFrom: string; // e.g., "from-primary/5" or "from-blue-500/5"
    iconColor: string; // e.g., "text-primary" or "text-blue-600 dark:text-blue-400"
    iconBg: string; // e.g., "bg-primary/10"
    borderColor?: string; // Optional border hover color
}

export function FeatureCard({
    to, icon: Icon, title, description, gradientFrom, iconColor, iconBg, borderColor
}: FeatureCardProps) {
    return (
        <Link
            to={to}
            className={cn(
                "group relative bg-card rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden",
                borderColor && `hover:${borderColor}` // Basic tailwind approach, might need dynamic class safelisting or inline style if arbitrary
            )}
        >
            {/* Gradient Glow Effect */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                gradientFrom
            )} />

            <div className="relative">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
                    iconBg
                )}>
                    <Icon className={cn("w-6 h-6", iconColor)} />
                </div>

                <h3 className={cn(
                    "text-lg font-semibold text-foreground mb-2 transition-colors",
                    iconColor.split(' ')[0].replace('text-', 'group-hover:text-') // Simple heuristic for hover color
                )}>
                    {title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Arrow indicator */}
                <div className={cn(
                    "absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0",
                    iconColor
                )}>
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
}
