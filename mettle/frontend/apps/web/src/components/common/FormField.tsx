import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
    error?: string;
}

/**
 * Reusable form field wrapper with label styling
 */
export function FormField({ label, children, className, required, error }: FormFieldProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <label className="text-xs font-semibold text-muted-foreground uppercase">
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
            )}
        </div>
    );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

/**
 * Styled form input with consistent styling
 */
export function FormInput({ className, error, ...props }: FormInputProps) {
    return (
        <input
            {...props}
            className={cn(
                "w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm",
                error && "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10",
                className
            )}
        />
    );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

/**
 * Styled form textarea with consistent styling
 */
export function FormTextarea({ className, error, ...props }: FormTextareaProps) {
    return (
        <textarea
            {...props}
            className={cn(
                "w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm resize-none",
                error && "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10",
                className
            )}
        />
    );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

/**
 * Styled form select with consistent styling
 */
export function FormSelect({ className, children, error, ...props }: FormSelectProps) {
    return (
        <select
            {...props}
            className={cn(
                "w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm appearance-none",
                error && "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10",
                className
            )}
        >
            {children}
        </select>
    );
}
