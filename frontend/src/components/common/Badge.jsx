import { cn } from "../../utils/cn";

/**
 * Badge variants configuration
 * each variant has a meaning in the application
 */

const badgeVariants = {
    variant : {
        // Status badges
    default: 'bg-gray-medium text-white',
    primary: 'bg-primary-red text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    
    // Product-specific badges
    new: 'bg-green-600 text-white',
    bestseller: 'bg-primary-red text-white',
    sale: 'bg-orange-500 text-white',
    
    // Order status badges 
    pending: 'bg-yellow-500 text-black',
    confirmed: 'bg-blue-600 text-white',
    rejected: 'bg-red-600 text-white',
    shipped: 'bg-purple-600 text-white',
    delivered: 'bg-green-600 text-white',
    cancelled: 'bg-gray-dark text-white',
    
    // Stock status
    inStock: 'bg-green-600 text-white',
    lowStock: 'bg-orange-500 text-white',
    outOfStock: 'bg-red-600 text-white',
    
    // Outline variants (lighter, less prominent)
    outlineDefault: 'border-2 border-gray-medium text-gray-dark bg-white',
    outlinePrimary: 'border-2 border-primary-red text-primary-red bg-white',
  },
  size: {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  },
};


const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className,
    ariaLabel,
    ...props
}) => {
    return (
        <span
            aria-label={ariaLabel}
            className={cn(
                // Base styles
                'inline-flex items-center gap-1.5',
                'font-medium rounded-full',
                'whitespace-nowrap',
                'transition-colors duration-200',
                
                // Variant styles
                badgeVariants.variant[variant],
                
                // Size styles
                badgeVariants.size[size],
                
                // Custom classes
                className
            )}
            {...props}
        
        >
            {/* optional status dot */}
            {dot && (
                <span
                className="w-1.5 h-1.5 rounded-full bg-current"
                aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
};

export default Badge