import { X, Upload } from 'lucide-react';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCandidateModal({ isOpen, onClose }: AddCandidateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-bold">Yeni Aday Ekle</h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4">
                    {/* CV Upload Mock */}
                    <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <p className="font-medium text-foreground">CV Yükle (PDF, DOCX)</p>
                        <p className="text-xs text-muted-foreground mt-1">Sürükle ve bırak veya dosyaları seç</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">veya manuel gir</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Ad</label>
                            <input type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="Ad" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Soyad</label>
                            <input type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="Soyad" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">E-posta</label>
                        <input type="email" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="ornek@email.com" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">Pozisyon (Rol)</label>
                        <input type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm" placeholder="Örn: Senior Frontend Developer" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">Kaynak (Source)</label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm">
                            <option>LinkedIn</option>
                            <option>Referral</option>
                            <option>Kariyer.net</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        İptal
                    </button>
                    <button className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:brightness-110 shadow-sm">
                        Adayı Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}
