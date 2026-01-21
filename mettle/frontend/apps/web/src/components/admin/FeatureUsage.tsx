import { BarChart3 } from 'lucide-react';

interface FeatureItem {
    count: number;
    percentage: number;
}

interface FeatureData {
    rag?: FeatureItem;
    text_to_sql?: FeatureItem;
    translation?: FeatureItem;
    summarization?: FeatureItem;
    speech_to_text?: FeatureItem;
}

interface FeatureUsageProps {
    loading: boolean;
    data: FeatureData | null;
}

export function FeatureUsage({ loading, data }: FeatureUsageProps) {
    // Map feature keys to readable names as per admin.js
    const features = [
        { key: 'rag', label: 'Doküman Analizi', count: data?.rag?.count || 0, pct: data?.rag?.percentage || 0 },
        { key: 'text_to_sql', label: 'Metin -> SQL', count: data?.text_to_sql?.count || 0, pct: data?.text_to_sql?.percentage || 0 },
        { key: 'translation', label: 'Çeviri', count: data?.translation?.count || 0, pct: data?.translation?.percentage || 0 },
        { key: 'summarization', label: 'Özetleme', count: data?.summarization?.count || 0, pct: data?.summarization?.percentage || 0 },
        { key: 'speech_to_text', label: 'Ses -> Metin', count: data?.speech_to_text?.count || 0, pct: data?.speech_to_text?.percentage || 0 },
    ];

    if (loading) {
        return (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border p-4">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        Özellik Kullanımı
                    </h3>
                </div>
                <div className="p-4 space-y-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-8 bg-muted rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-primary/5 border-b border-border p-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Özellik Kullanımı
                </h3>
            </div>
            <div className="p-4 space-y-5">
                {features.map((feature) => (
                    <div key={feature.key} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{feature.label}</span>
                            <span className="text-muted-foreground">{feature.count} kullanım</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${feature.pct}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
