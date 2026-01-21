import { useEffect, RefObject } from 'react';

/**
 * Hook to detect clicks outside of a specified element
 * Useful for closing dropdowns, popovers, and sidebars
 * 
 * @param ref - React ref of the element to detect outside clicks for
 * @param callback - Function to call when a click outside is detected
 * @param enabled - Optional flag to enable/disable the listener (default: true)
 * 
 * @example
 * ```tsx
 * function Dropdown({ onClose }) {
 *   const ref = useRef<HTMLDivElement>(null);
 *   useClickOutside(ref, onClose);
 *   return <div ref={ref}>Dropdown Content</div>;
 * }
 * ```
 */
export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    callback: () => void,
    enabled: boolean = true
): void {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        // Use mousedown for better UX (fires before blur)
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback, enabled]);
}
