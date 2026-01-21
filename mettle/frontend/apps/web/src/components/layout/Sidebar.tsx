import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Route, CreditCard, Database, FileText,
    Users, Sparkles, Search, Briefcase, Calendar,
    PanelLeftClose,
    Headphones, Settings, LogOut, X, Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();
    // Initialize state directly from local storage to prevent flicker
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebar-collapsed') === 'true';
        }
        return false;
    });

    // Effect only needed if we want to sync external changes, but for now direct init is enough
    useEffect(() => {
        // Optional: Listen to storage events or just rely on local state
    }, []);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };


    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Briefcase, label: 'Jobs', path: '/jobs' },
        { icon: Calendar, label: 'Planner', path: '/planner' },
        { icon: Users, label: 'Candidates', path: '/candidates' }, // Module 1
        { icon: Route, label: 'Pipeline', path: '/pipeline' }, // Module 3
        { icon: Sparkles, label: 'AI Assistant', path: '/ai-assistant' }, // Module 2
        { icon: FileText, label: 'Assessment', path: '/assessment' }, // Module 4 (Placeholder)
        { icon: CreditCard, label: 'Offer & Onboard', path: '/offer' }, // Module 5 (Placeholder)
        { icon: Database, label: 'Analytics', path: '/analytics' }, // Module 6 (Placeholder)
    ];

    return (
        <div
            className={cn(
                "flex flex-col flex-shrink-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-30 border-r border-border",
                collapsed ? "w-20" : "w-80"
            )}
        >
            <div className="flex flex-col h-full p-4">
                {/* Header */}
                <div className={cn(
                    "flex mb-4 px-2 py-3 transition-all relative",
                    collapsed ? "flex-col items-center justify-center" : "justify-between items-center"
                )}>
                    <div
                        className={cn(
                            "flex items-center gap-3 whitespace-nowrap transition-all duration-300 relative group",
                            collapsed ? "justify-center w-full cursor-pointer overflow-visible" : "overflow-hidden"
                        )}
                        onClick={collapsed ? toggleSidebar : undefined}
                    >
                        {/* Logo / Toggle Button Wrapper */}
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-primary-foreground flex-shrink-0 transition-all duration-200",
                            // Hover state when collapsed: Light/Accent background (like standard button)
                            collapsed ? "group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground bg-primary" : "bg-primary"
                        )}>
                            {/* Show Icon when collapsed & hovered, otherwise 'M' */}
                            <div className={cn("absolute transition-opacity duration-200", collapsed ? "group-hover:opacity-100 opacity-0" : "hidden")}>
                                <PanelLeftClose className="w-5 h-5 rotate-180" />
                            </div>
                            <div className={cn("transition-opacity duration-200", collapsed ? "group-hover:opacity-0 opacity-100" : "opacity-100")}>
                                <Command className="w-5 h-5" />
                            </div>
                        </div>

                        <span className={cn(
                            "font-bold text-lg tracking-tight transition-opacity duration-300",
                            collapsed ? "hidden w-0" : "opacity-100"
                        )}>
                            Mettle ATS
                        </span>

                        {/* Tooltip - Only when collapsed and hovered */}
                        {collapsed && (
                            <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2 py-1.5 bg-foreground text-background text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-md z-50">
                                Kenar çubuğunu aç
                                {/* Triangle/Arrow */}
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground"></div>
                            </div>
                        )}
                    </div>

                    {/* Separate Toggle Button - Hidden when collapsed as Logo acts as toggle */}
                    {!collapsed && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className={cn(
                    "mb-4 px-1 transition-all duration-300",
                    collapsed ? "flex justify-center" : ""
                )}>
                    {collapsed ? (
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-accent-foreground transition-colors"
                            title="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-sidebar-accent-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-9 pr-4 py-2 bg-sidebar-accent/50 hover:bg-sidebar-accent/80 focus:bg-sidebar-accent border border-transparent rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sidebar-ring focus:border-sidebar-ring transition-all placeholder:text-muted-foreground text-sidebar-foreground"
                            />
                        </div>
                    )}
                </div>

                {/* Main Navigation */}
                <div className="flex-grow overflow-y-auto px-1 space-y-1">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all group",
                                    collapsed && "justify-center px-0",
                                    active
                                        ? collapsed
                                            ? "bg-primary/10 text-primary"
                                            : "bg-gray-200 dark:bg-sidebar-accent text-sidebar-foreground"
                                        : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("w-5 h-5 flex-shrink-0", active && "text-primary")} />
                                <span className={cn("truncate", collapsed && "hidden")}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="mt-auto space-y-4 pt-4 border-t border-sidebar-border">

                    {/* Support Card - Only visible when expanded */}
                    {!collapsed && (
                        <div className="bg-background border border-border rounded-xl p-4 shadow-sm relative mx-1">
                            <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones className="w-5 h-5 text-foreground" />
                                <h4 className="font-bold text-sm">Need Support</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                Contact with one of our experts to get support.
                            </p>
                            <button className="w-full bg-background border border-border rounded-lg py-1.5 text-xs font-bold hover:bg-muted transition-colors">
                                Call the Experts
                            </button>
                        </div>
                    )}

                    {/* Settings & Logout */}
                    <div className="space-y-1">
                        <Link
                            to="/settings"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                "transition-colors", // Add transition for smoother color changes
                                collapsed && "justify-center"
                            )}
                        >
                            <Settings className="w-5 h-5 flex-shrink-0" />
                            <span className={cn("truncate", collapsed && "hidden")}>Settings</span>
                        </Link>
                        <button
                            onClick={logout}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
                                collapsed && "justify-center"
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span className={cn("truncate", collapsed && "hidden")}>Log Out</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
