import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30": variant === 'default',
            "border border-border hover:bg-muted": variant === 'outline',
            "hover:bg-muted": variant === 'ghost',
            "bg-red-500 text-white hover:bg-red-600": variant === 'destructive',
            "h-10 py-2 px-5": size === 'default',
            "h-9 px-3": size === 'sm',
            "h-12 px-8 text-base": size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
