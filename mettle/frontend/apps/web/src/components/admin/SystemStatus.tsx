import {
    Activity, RefreshCw, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemHealthData {
    status?: 'healthy' | 'degraded' | 'error';
    embedding_api?: string;
    chroma_db?: string;
    feedback_db?: string;
    ollama?: string;
    error?: string;
    [key: string]: string | undefined; // Index signature for dynamic access
}

interface SystemStatusProps {
    loading: boolean;
    data: SystemHealthData | null;
    onRefresh: () => void;
}

export function SystemStatus({ loading, data, onRefresh }: SystemStatusProps) {
    // Services array removed as we use infraServices for now

    // In a real app, `data` from /health would map to these services.
    // For now, mirroring `admin.html` logic which had some dynamic checks but also static.
    // `admin.js` fetches ` / health` and updates a separate "Health Status" skeleton/content but the HTML structure for System Status card
    // seemed to have hardcoded services with dynamic badges? 
    // Looking at admin.html:
    // It has a `healthStatus` div which gets populated by `admin.js` > `refreshHealth()`
    // BUT `admin.html` ALSO has a `healthStatus` div hardcoded with services like RAG API, Text-to-SQL etc.
    // Wait, line 226 in admin.html starts the actual content.
    // It lists 5 services.
    // `admin.js` refreshHealth() function, lines 60+, actually builds a TOTALLY DIFFERENT HTML structure!
    // It builds "Overall Status Banner" and "Services Grid" (Embedding, ChromaDB, MongoDB, Ollama).
    // The HTML file has localized service checks (RAG, Text-to-SQL).
    // This is a discrepancy. `admin.js` content seems to OVERWRITE or be injected into `healthStatus` div.
    // Let's look at `admin.html` again.
    // `< div id = "healthStatus" class="hidden p-4 space-y-3" > ` contains hardcoded RAG API, Text-to-SQL etc.
    // BUT `admin.js` attempts to set `healthStatus.innerHTML = html` where html is the banner + grid.
    // So the hardcoded content in `admin.html` is likely PLACEHOLDER or legacy, and `admin.js` replaces it.
    // I should follow `admin.js` logic which shows component/infrastructure health (Chroma, Ollama, etc.)
    // rather than "feature" health which seems static in HTML.

    // Actually, `admin.js` replaces `innerHTML` of `healthStatus` element.
    // So the "RAG API", "Text-to-SQL" list in `admin.html` is REPLACED by "Embedding API", "ChromaDB", "MongoDB", "Ollama".
    // I will implement the `admin.js` version (Infrastructure Health).

    const infraServices = [
        { key: 'embedding_api', name: 'Embedding', desc: 'API', icon: 'cpu' },
        { key: 'chroma_db', name: 'ChromaDB', desc: 'Vektör DB', icon: 'database' },
        { key: 'feedback_db', name: 'MongoDB', desc: 'Feedback', icon: 'hard-drive' },
        { key: 'ollama', name: 'Ollama', desc: 'LLM', icon: 'bot' }
    ];

    const isHealthy = data?.status === 'healthy';

    if (loading) {
        return (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border p-4 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Sistem Durumu
                    </h3>
                </div>
                <div className="p-4 space-y-3 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 bg-muted rounded-lg"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-primary/5 border-b border-border p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Sistem Durumu
                    </h3>
                    <button
                        onClick={onRefresh}
                        className="p-1.5 hover:bg-muted rounded-full transition-colors"
                        title="Yenile"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Overall Status Banner */}
                <div className={cn(
                    "relative overflow-hidden rounded-xl p-4",
                    isHealthy ? "bg-gradient-to-r from-primary/10 to-primary/5" : "bg-gradient-to-r from-destructive/10 to-destructive/5"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            isHealthy ? "bg-primary/20" : "bg-destructive/20"
                        )}>
                            <Activity className={cn("w-6 h-6", isHealthy ? "text-primary" : "text-destructive")} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className={cn("text-sm font-semibold", isHealthy ? "text-primary" : "text-destructive")}>
                                    {isHealthy ? 'Tüm Sistemler Çalışıyor' : 'Sistem Sorunu Tespit Edildi'}
                                </span>
                                <span className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                    isHealthy ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                                )}>
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-full animate-pulse",
                                        isHealthy ? "bg-primary" : "bg-destructive"
                                    )}></span>
                                    {isHealthy ? 'Aktif' : 'Kritik'}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Son güncelleme: {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {infraServices.map(service => {
                        const status = data?.[service.key];
                        const isServiceHealthy = status === 'healthy';

                        return (
                            <div key={service.key} className={cn(
                                "group relative p-3 rounded-xl border transition-all duration-200",
                                isServiceHealthy
                                    ? "border-border hover:border-primary/50 hover:bg-primary/5"
                                    : "border-destructive/30 bg-destructive/5"
                            )}>
                                <div className="flex items-start gap-2.5">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                        isServiceHealthy ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                                    )}>
                                        {/* Simplified icons for now */}
                                        <Database className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                                            <span className={cn(
                                                "w-2 h-2 rounded-full",
                                                isServiceHealthy ? "bg-primary" : "bg-destructive animate-pulse"
                                            )}></span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{service.desc}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {data?.error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                        <p className="font-medium">Hata:</p>
                        <p>{data.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
