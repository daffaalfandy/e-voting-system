import { ButtonHTMLAttributes } from 'react';

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'success' | 'danger';
}

const VARIANT_STYLES = {
    primary: 'bg-deep-slate hover:bg-slate-800 text-white',
    success: 'bg-coblos-green hover:bg-green-700 text-white',
    danger: 'bg-indonesian-red hover:bg-red-700 text-white',
};

export function BigButton({ variant = 'primary', className = '', children, disabled, ...props }: BigButtonProps) {
    return (
        <button
            className={`
        min-h-touch min-w-touch px-8 py-4
        text-2xl font-bold uppercase tracking-wide
        rounded-lg shadow-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:shadow-md active:translate-y-0.5
        ${VARIANT_STYLES[variant]}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
