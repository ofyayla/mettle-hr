import { CreditCard, FileCheck, PartyPopper, Send, Rocket } from 'lucide-react';
// import { cn } from '@/lib/utils'; // Keep if needed

export function OfferPage() {
    return (
        <div className="flex flex-col h-full overflow-hidden p-6 gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <PartyPopper className="w-6 h-6 text-primary" />
                    Teklif ve Onboarding
                </h2>
                <p className="text-sm text-muted-foreground">
                    Teklifleri yönetin ve yeni çalışanların işe başlama sürecini planlayın.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-6">
                {/* Offer Management */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        Teklif Bekleyenler
                    </h3>

                    <div className="space-y-3">
                        <OfferCard
                            candidate="Zeynep Çelik"
                            role="UX Designer"
                            salary="75.000 ₺"
                            status="Onay Bekliyor"
                        />
                        <OfferCard
                            candidate="Ahmet Yılmaz"
                            role="DevOps Engineer"
                            salary="95.000 ₺"
                            status="Adayda"
                        />
                    </div>
                </div>

                {/* Pre-onboarding Status */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-muted-foreground" />
                        İşe Başlama (Onboarding)
                    </h3>

                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">Evrak Takibi</h4>
                                <p className="text-sm text-muted-foreground">3 aday evraklarını yükledi</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <OnboardingItem name="Zeynep Çelik" progress={100} status="Tamamlandı" />
                            <OnboardingItem name="Can Vural" progress={60} status="Evrak Bekleniyor" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OfferCard({ candidate, role, salary, status }: { candidate: string, role: string, salary: string, status: string }) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg">{candidate}</h4>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
                <span className="px-2 py-1 bg-muted rounded text-xs font-medium">{status}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
                <span className="font-mono font-medium text-primary-700 dark:text-primary-foreground">{salary} <span className="text-xs text-muted-foreground">/ Ay + Yan Haklar</span></span>
                <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 flex items-center gap-2 text-xs font-bold transition-all">
                    <Send className="w-3 h-3" />
                    Teklifi Gönder
                </button>
            </div>
        </div>
    );
}

function OnboardingItem({ name, progress, status }: { name: string, progress: number, status: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold">
                {name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium truncate">{name}</span>
                    <span className="text-[10px] text-muted-foreground">{status}</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
}
