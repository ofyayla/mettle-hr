import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardRowProps {
    children: React.ReactNode;
    className?: string;
}

export function DashboardRow({ children, className }: DashboardRowProps) {
    return (
        <div
            className={cn(
                "flex gap-4 h-full min-h-0",
                className
            )}
        >
            {children}
        </div>
    );
}
