import { cn } from "../../utils/cn";

/**
 * Button Component - "Light in Motion" Design System
 * 
 * Premium button component with warm glow effects, refined animations,
 * and accessibility-first design.
 * 
 * VARIANTS:
 * - primary: Brand orange with warm glow hover
 * - secondary: Charcoal with elegant hover
 * - outline: Outlined with fill hover transition
 * - ghost: Minimal with subtle hover
 * - danger: Red for destructive actions
 * 
 * USAGE:
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Shop Now
 * </Button>
 */

const buttonVariants = {
  variant: {
    primary: 'bg-brand-orange text-white hover:bg-brand-red hover:shadow-glow-md active:scale-[0.98] focus-visible:ring-brand-orange transition-all duration-normal',
    secondary: 'bg-charcoal text-white hover:bg-brand-orange active:scale-[0.98] focus-visible:ring-charcoal transition-all duration-normal',
    outline: 'border-2 border-charcoal text-charcoal bg-transparent hover:bg-charcoal hover:text-white active:scale-[0.98] focus-visible:ring-charcoal transition-all duration-normal',
    ghost: 'text-charcoal hover:bg-warm-paper active:bg-gray-light focus-visible:ring-muted-neutral transition-colors duration-fast',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-red-600 transition-all duration-normal',
  },
  size: {
    sm: 'px-4 py-2 text-label-lg',
    md: 'px-6 py-3 text-body-sm font-semibold',
    lg: 'px-8 py-4 text-body-md font-bold tracking-wide',
    xl: 'px-10 py-5 text-title-sm font-bold tracking-wide',
  },
};

/**
 * Button Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} props.variant - Visual style variant
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state (shows spinner, disables button)
 * @param {Function} props.onClick - Click handler
 * @param {'button'|'submit'|'reset'} props.type - HTML button type
 * @param {string} props.className - Additional classes
 * @param {string} props.ariaLabel - Accessibility label
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-medium rounded-soft',
        'transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'uppercase tracking-wider',
        
        // Variant styles
        buttonVariants.variant[variant],
        
        // Size styles
        buttonVariants.size[size],
        
        // Width
        fullWidth && 'w-full',
        
        // Loading state
        loading && 'relative',
        
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
      {children}
    </button>
  );
};

export default Button;