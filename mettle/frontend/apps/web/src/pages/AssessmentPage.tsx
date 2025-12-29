import { Calendar, Video, Clock, CheckCircle2, Star, User } from 'lucide-react';

export function AssessmentPage() {
    return (
        <div className="flex flex-col h-full overflow-hidden p-6 gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Değerlendirme Merkezi
                </h2>
                <p className="text-sm text-muted-foreground">
                    Mülakatları planlayın ve adayları puanlayın.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-6">
                {/* Upcoming Interviews */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Yaklaşan Mülakatlar
                    </h3>
                    <div className="space-y-3">
                        <InterviewCard
                            candidateName="Ali Yılmaz"
                            role="Senior React Developer"
                            time="Bugün, 14:00"
                            type="Teknik Mülakat"
                        />
                        <InterviewCard
                            candidateName="Mehmet Kaya"
                            role="Backend Developer"
                            time="Yarın, 10:30"
                            type="Kültür Mülakatı"
                        />
                        <InterviewCard
                            candidateName="Ayşe Demir"
                            role="Product Manager"
                            time="28 Ekim, 15:00"
                            type="Case Sunumu"
                        />
                    </div>
                </div>

                {/* Scorecard Area */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 flex flex-col h-fit">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Mülakat Değerlendirme Formu</h3>
                            <p className="text-sm text-muted-foreground">Ali Yılmaz - Senior React Developer</p>
                        </div>
                        <div className="bg-primary/10 text-primary-700 dark:text-primary-foreground px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                            Canlı Görüşme
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ScoreSection title="Teknik Yetkinlikler" criteria={[
                            "React & Hooks Hakimiyeti",
                            "State Management (Redux/Zustand)",
                            "TypeScript Kullanımı",
                            "Performans Optimizasyonu"
                        ]} />

                        <ScoreSection title="Soft Skills & Kültür" criteria={[
                            "İletişim Becerileri",
                            "Takım Çalışması",
                            "Problem Çözme Yaklaşımı",
                            "İngilizce Seviyesi"
                        ]} />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Genel Notlar</label>
                            <textarea className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Adayın güçlü ve zayıf yönleri..." />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                                Taslağı Kaydet
                            </button>
                            <button className="px-6 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:brightness-110 shadow-sm">
                                Değerlendirmeyi Tamamla
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InterviewCard({ candidateName, role, time, type }: { candidateName: string, role: string, time: string, type: string }) {
    return (
        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">{candidateName}</h4>
                        <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                </div>
                <button className="p-1.5 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Video className="w-4 h-4" />
                </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border mt-2">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{type}</span>
                </div>
            </div>
        </div>
    );
}

function ScoreSection({ title, criteria }: { title: string, criteria: string[] }) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold border-b border-border pb-1">{title}</h4>
            <div className="space-y-2">
                {criteria.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                        <span className="text-sm text-foreground/80">{item}</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="text-muted-foreground hover:text-yellow-500 transition-colors focus:text-yellow-500">
                                    <Star className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
