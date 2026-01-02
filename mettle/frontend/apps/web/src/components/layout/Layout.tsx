import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Sun, Moon, Bell, Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    // Initialize theme state from local storage or system preference to match index.html script
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) return storedTheme as 'light' | 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // Effect to keep state in sync if needed, but the main work is done by init logic now
    useEffect(() => {
        // Ensure class is correct on hydration (backup)
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);


    return (
        <div className="h-screen flex w-full bg-sidebar overflow-hidden font-sans antialiased text-foreground">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">
                {/* GLOBAL HEADER */}
                <header className="h-16 px-6 flex items-center justify-end flex-shrink-0 border-b border-border">


                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 pl-4">
                        {/* Theme Toggle - Segmented Control */}
                        <div className="flex items-center p-1 bg-muted/50 rounded-md border border-border">
                            <button
                                onClick={() => {
                                    setTheme('light');
                                    localStorage.setItem('theme', 'light');
                                    document.documentElement.classList.remove('dark');
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold transition-all duration-200",
                                    theme === 'light'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Sun className="w-3.5 h-3.5" />
                                <span>Light</span>
                            </button>
                            <button
                                onClick={() => {
                                    setTheme('dark');
                                    localStorage.setItem('theme', 'dark');
                                    document.documentElement.classList.add('dark');
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-bold transition-all duration-200",
                                    theme === 'dark'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Moon className="w-3.5 h-3.5" />
                                <span>Dark</span>
                            </button>
                        </div>

                        <div className="h-6 w-px bg-border/40 mx-1"></div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button className="p-2.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border/40">
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border/40">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border/40 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                            </button>
                        </div>

                        {/* Profile */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden ml-2 cursor-pointer hover:ring-2 ring-primary/20 transition-all">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT CONTAINER */}
                <div className="flex-1 px-4 pb-4 overflow-hidden">
                    <main className="h-full w-full overflow-hidden flex flex-col relative">
                        {/* Content wrapper with scroll */}
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
