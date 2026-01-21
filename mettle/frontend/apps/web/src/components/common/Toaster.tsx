import { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Global toast notification container
 * Uses react-hot-toast with custom styling to match the app theme
 */
export function Toaster() {
    return (
        <HotToaster
            position="bottom-right"
            gutter={8}
            containerStyle={{
                bottom: 24,
                right: 24,
            }}
            toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    padding: '12px 16px',
                    fontSize: '14px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
                // Success toast styling
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'hsl(var(--primary-foreground))',
                    },
                },
                // Error toast styling
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: 'hsl(var(--destructive))',
                        secondary: 'hsl(var(--destructive-foreground))',
                    },
                },
                // Loading toast styling
                loading: {
                    iconTheme: {
                        primary: 'hsl(var(--muted-foreground))',
                        secondary: 'hsl(var(--muted))',
                    },
                },
            }}
        />
    );
}
