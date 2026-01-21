import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    UserCog, Building, Plug, Shield,
    GitMerge, Mail, Lock, LayoutTemplate
} from 'lucide-react';

type NavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
};

type NavGroup = {
    heading: string;
    items: NavItem[];
};

const sidebarNavGroups: NavGroup[] = [
    {
        heading: "Organization",
        items: [
            { title: "General", href: "/settings", icon: Building },
            { title: "User Management", href: "/settings/users", icon: UserCog },
            { title: "Integrations", href: "/settings/integrations", icon: Plug },
        ]
    },
    {
        heading: "Workflow",
        items: [
            { title: "Pipeline", href: "/settings/pipeline", icon: GitMerge },
            { title: "Templates", href: "/settings/templates", icon: Mail },
        ]
    },
    {
        heading: "Security",
        items: [
            { title: "Security & Audit", href: "/settings/security", icon: Shield },
            { title: "SSO Configuration", href: "/settings/sso", icon: Lock },
        ]
    }
];

function SidebarNav({ className, groups, ...props }: React.HTMLAttributes<HTMLElement> & { groups: NavGroup[] }) {
    const location = useLocation();

    return (
        <nav className={cn("flex flex-col space-y-8", className)} {...props}>
            {groups.map((group, index) => (
                <div key={index} className="flex flex-col space-y-2">
                    <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                        {group.heading}
                    </h4>
                    <div className="space-y-1">
                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                to={!item.disabled ? item.href : '#'}
                                className={cn(
                                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    location.pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
}

export function SettingsLayout() {
    return (
        <div className="space-y-6 p-10 pb-16 w-full max-w-7xl mx-auto">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your organization settings, workflows, and security preferences.
                </p>
            </div>
            <div className="my-6 border-t border-border" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav groups={sidebarNavGroups} />
                </aside>
                <div className="flex-1 lg:max-w-4xl">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
