import { useState } from 'react';
import { Bot, FileText, Mail, Sparkles, Copy, Check } from 'lucide-react';
// import { cn } from '@/lib/utils'; // Implicitly available if configured, checking path... actually I should double check if I need to import it or if I can just use classes. I'll import it.
import { cn } from '@/lib/utils';

export function AIToolsPage() {
    const [activeTab, setActiveTab] = useState<'jd' | 'email'>('jd');

    return (
        <div className="flex flex-col h-full overflow-hidden p-6 gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    AI Assistant
                </h2>
                <p className="text-sm text-muted-foreground">
                    Yapay zeka desteği ile iş tanımları ve aday iletişim metinleri oluşturun.
                </p>
            </div>

            <div className="flex items-center gap-4 border-b border-border">
                <button
                    onClick={() => setActiveTab('jd')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'jd'
                            ? "border-primary text-primary-700 dark:text-primary-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <FileText className="w-4 h-4" />
                    Job Description Generator
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'email'
                            ? "border-primary text-primary-700 dark:text-primary-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Mail className="w-4 h-4" />
                    Email Generator
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'jd' ? <JDGenerator /> : <EmailGenerator />}
            </div>
        </div>
    );
}

function JDGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setResult(`
# Senior React Developer

## Hakkımızda
GenAI Lab olarak yapay zeka teknolojileri ile İK süreçlerini dönüştürüyoruz.

## Aranan Nitelikler
- En az 5 yıl React ve TypeScript deneyimi
- Modern frontend araçlarına (Vite, Tailwind, Next.js) hakimiyet
- REST API ve WebSocket entegrasyonlarında tecrübeli
- Temiz kod prensiplerine sadık

## Sorumluluklar
- Ölçeklenebilir UI bileşenleri geliştirmek
- Code review süreçlerine liderlik etmek
- UX/UI ekibi ile yakın çalışmak
            `);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-full">
            <div className="bg-card border border-border rounded-xl p-6 h-fit">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pozisyon Adı</label>
                        <input type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="örn. Senior Frontend Developer" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deneyim (Yıl)</label>
                            <input type="number" className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="5" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lokasyon</label>
                            <input type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="İstanbul / Remote" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Anahtar Kelimeler / Yetkinlikler</label>
                        <textarea className="w-full px-3 py-2 border border-border rounded-lg bg-background h-24 resize-none" placeholder="React, TypeScript, Tailwind, Liderlik..." />
                    </div>

                    <button disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:brightness-110 disabled:opacity-50 transition-all">
                        {loading ? <Bot className="w-5 h-5 animate-bounce" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? 'Oluşturuluyor...' : 'Oluştur'}
                    </button>
                </form>
            </div>

            <div className="bg-muted/30 border border-border rounded-xl p-6 relative min-h-[400px]">
                {!result && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                        <Bot className="w-12 h-12 mb-2" />
                        <p>Detayları girin ve AI sizin için taslağı oluştursun.</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-muted-foreground animate-pulse">Yapay zeka düşünüyor...</p>
                    </div>
                )}

                {result && (
                    <>
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result.trim());
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                            </button>
                        </div>
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-mono text-sm">
                            {result.trim()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function EmailGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false); // Added missing state

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setResult(`
Sayın Ali Yılmaz,

Başvurunuzu dikkatle inceledik. React konusundaki deneyiminiz ve geçmiş projeleriniz bizi oldukça etkiledi. 

Sizi ekibimizle tanışmak ve pozisyon detaylarını konuşmak üzere bir ön görüşmeye davet etmek istiyoruz.

Müsait olduğunuz zaman dilimlerini paylaşırsanız sevinirim.

Saygılarımla,
İK Ekibi
            `);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-full">
            <div className="bg-card border border-border rounded-xl p-6 h-fit">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Aday Adı</label>
                        <input type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="Ali Yılmaz" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">İletişim Türü</label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                            <option value="invite">Mülakat Daveti</option>
                            <option value="reject">Red Mektubu</option>
                            <option value="offer">Teklif Gönderimi</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ton (Tone of Voice)</label>
                        <div className="flex gap-2">
                            {['Resmi', 'Samimi', 'Heyecanlı'].map(tone => (
                                <button type="button" key={tone} className="flex-1 py-2 text-xs border border-border rounded-lg hover:bg-muted focus:bg-primary/10 focus:border-primary focus:text-primary transition-colors">
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:brightness-110 disabled:opacity-50 transition-all">
                        {loading ? <Bot className="w-5 h-5 animate-bounce" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? 'Yazılıyor...' : 'Taslak Oluştur'}
                    </button>
                </form>
            </div>

            <div className="bg-muted/30 border border-border rounded-xl p-6 relative min-h-[400px]">
                {!result && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                        <Mail className="w-12 h-12 mb-2" />
                        <p>Aday bilgilerini seçin ve e-posta taslağını oluşturun.</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-muted-foreground animate-pulse">AI metni hazırlıyor...</p>
                    </div>
                )}

                {result && (
                    <>
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result.trim());
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                            </button>
                        </div>
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-sm p-4 bg-card rounded-lg border border-border shadow-sm">
                            {result.trim()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
