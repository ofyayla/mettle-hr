import { useEffect } from 'react';

/**
 * Hook to handle keyboard events for modals
 * Closes the modal when Escape key is pressed
 * 
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Callback to close the modal
 * 
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   useModalKeyboard(isOpen, onClose);
 *   if (!isOpen) return null;
 *   return <div>Modal Content</div>;
 * }
 * ```
 */
export function useModalKeyboard(isOpen: boolean, onClose: () => void): void {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
            }
        };

        // Use capture phase to ensure this runs first
        document.addEventListener('keydown', handleKeyDown, { capture: true });

        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, [isOpen, onClose]);
}
