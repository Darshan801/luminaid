import { Children } from "react";
import { cn } from "../../utils/cn";

/**
 * Button variants configurations
 * 
 */

const buttonVariants = {
    variant:{
        primary: 'bg-primary-red text-white hover:bg-dark-red active:bg-dark-red/90 focus-visible:ring-primary-red',
        secondary: 'bg-black text-white hover:bg-gray-dark active:bg-gray-dark/90 focus-visible:ring-black',
        outline: 'border-2 border-black text-black bg-white hover:bg-black hover:text-white focus-visible:ring-black',
        ghost: 'text-black hover:bg-gray-light active:bg-gray-light/80 focus-visible:ring-gray-medium',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600',
    },
    size: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
};

/**
 * Reusable Button Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} props.variant - Visual style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state (shows spinner, disables button)
 * @param {Function} props.onClick - Click handler
 * @param {'button'|'submit'|'reset'} props.type - HTML button type
 * @param {string} props.className - Additional classes
 * @param {string} props.ariaLabel - Accessibility label
 */
const Button = ({
    Children , variant = 'primary' , size = 'md' ,   fullWidth = false, disabled = false,
    loading = false, onClick, type = 'button', className, ariaLabel,...props
})=>{
    return(
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={ariaLabel}
            aria-busy={loading}
            className={cn(
                // Base styles
                'inline-flex items-center justify-center gap-2',
                'font-medium rounded-md',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                
                // Variant styles
                buttonVariants.variant[variant],
                
                // Size styles
                buttonVariants.size[size],
                
                // Width
                fullWidth && 'w-full',
                
                // Custom className
                className
            )}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {Children}
        </button>
    );
};
export default Button;