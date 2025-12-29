import {
    MessageSquare, CreditCard, Database, FileText, Languages, Search, Mic, PenLine
} from 'lucide-react';
import { FeatureCard } from '@/components/common/FeatureCard';

export function LandingPage() {
    const features = [
        {
            to: '/chat',
            icon: MessageSquare,
            title: 'Chat with Your Document',
            description: 'Dokümanlarınızla sohbet edin ve sorularınıza anında yanıt alın',
            gradientFrom: 'from-primary/5',
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            borderColor: 'border-primary/40' // Note: This might need complete class in Tailwind
        },
        {
            to: '/credit-rag',
            icon: CreditCard,
            title: 'Credit Rag System',
            description: 'Kredi dokümanlarını analiz edin ve finansal verileri sorgulayın',
            gradientFrom: 'from-teal-500/5',
            iconColor: 'text-teal-600 dark:text-teal-400',
            iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
            borderColor: 'border-teal-500/40'
        },
        {
            to: '/text-to-sql',
            icon: Database,
            title: 'Text to SQL',
            description: 'Doğal dil sorguları ile SQL kodları oluşturun',
            gradientFrom: 'from-blue-500/5',
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
            borderColor: 'border-blue-500/40'
        },
        {
            to: '/summarization',
            icon: FileText,
            title: 'Summarization',
            description: 'Metinlerinizi ve dokümanlarınızı özetleyin',
            gradientFrom: 'from-green-500/5',
            iconColor: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-green-500/10 dark:bg-green-500/20',
            borderColor: 'border-green-500/40'
        },
        {
            to: '/translation',
            icon: Languages,
            title: 'Translation',
            description: 'Metinleri farklı diller arasında çevirin',
            gradientFrom: 'from-purple-500/5',
            iconColor: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
            borderColor: 'border-purple-500/40'
        },
        {
            to: '/sql-query-selection',
            icon: Search,
            title: 'SQL Query Selection',
            description: 'Şablon tabanlı SQL sorgu oluşturucu',
            gradientFrom: 'from-amber-500/5',
            iconColor: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
            borderColor: 'border-amber-500/40'
        },
        {
            to: '/speech-to-text',
            icon: Mic,
            title: 'Speech to Text',
            description: 'Ses dosyalarınızı ve kayıtlarınızı metne dönüştürün',
            gradientFrom: 'from-pink-500/5',
            iconColor: 'text-pink-600 dark:text-pink-400',
            iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
            borderColor: 'border-pink-500/40'
        },
        {
            to: '/prompt-to-text',
            icon: PenLine,
            title: 'Prompt to Text',
            description: 'Prompt ile özelleştirilmiş metinler oluşturun',
            gradientFrom: 'from-indigo-500/5',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
            borderColor: 'border-indigo-500/40'
        }
    ];

    return (
        <div className="flex flex-col min-h-full bg-background p-6 md:p-8">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl w-full">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center items-center pt-8 pb-4 mt-auto">
                <img
                    src="/img/albarakatech.svg"
                    alt="Albaraka Tech"
                    className="h-6 opacity-60 hover:opacity-100 transition-opacity dark:hidden"
                />
                <img
                    src="/img/albarakatech.svg"
                    alt="Albaraka Tech"
                    className="h-6 opacity-60 hover:opacity-100 transition-opacity hidden dark:block dark:brightness-0 dark:invert"
                />
            </div>
        </div>
    );
}
