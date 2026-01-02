import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, description }: DeleteConfirmationModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopImmediatePropagation();
                e.preventDefault();
                onClose();
            }
        };

        if (isOpen) {
            // Use capture phase to intercept event before other listeners
            window.addEventListener('keydown', handleKeyDown, true);
        }

        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-200 p-6">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="flex gap-3 w-full mt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border/50 hover:bg-muted text-muted-foreground font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
