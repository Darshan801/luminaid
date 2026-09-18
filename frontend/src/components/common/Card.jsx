import { cn } from '../../utils/cn'

/**
 * Production Card Component
 * Flexible container with consistent styling across the application
 * 
 * USAGE:
 * - Product cards in product grid
 * - Order summary cards
 * - Admin dashboard stat cards
 * - Review/testimonial cards
 * - Any boxed content that needs elevation
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.hoverable - Enable hover effect (scale + shadow)
 * @param {boolean} props.clickable - Shows pointer cursor and adds focus styles
 * @param {Function} props.onClick - Click handler
 * @param {string} props.padding - Padding variant
 * @param {string} props.className - Additional classes
 */


const Card = ({
    children ,
    hoverable = false,
    clickable = false,
    onClick,
    padding='default',
    className,
    ...props
}) => {
    const paddingVariants = {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
    };

    // Determine if card should be interactive
    const isInteractive = hoverable || clickable || onClick;

    return(
        <div
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onClick(e);
                        }
                        }
                    : undefined
                }
                className={cn(
                // Base styles
                'bg-white rounded-lg shadow-md overflow-hidden',
                'transition-all duration-300',
                
                // Padding
                paddingVariants[padding],
                
                // Interactive states
                isInteractive && 'cursor-pointer',
                hoverable && 'hover:shadow-xl hover:scale-[1.02]',
                onClick && 'focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2',
                
                // Custom classes
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * card.Header - optional header section with consistent styling
 */
Card.Header = ({ children , className}) => (
    <div className={cn('border-b border-gray-200 pb-4 mb-4',className)}>{children}</div>
);

// Card.Body - Main content area 
Card.Body = ({ children ,  className }) => (
    <div className={cn(className)}>{children}</div>
);

// Card.Footer - optional footer section(actions , metadata)
Card.Footer = ({ children , className }) => (
    <div className={cn('border-t border-gray-200 pt-4 mt-4' , className)}> {children}</div>
);

export default Card;