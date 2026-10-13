import { cn } from '../../utils/cn';

/**
 * Card Component - "Light in Motion" Design System
 * 
 * Flexible container with consistent styling and elevation.
 * 
 * FEATURES:
 * - Refined shadow system
 * - Hover lift effect
 * - Soft border radius
 * - Accessible focus states
 * 
 * USAGE:
 * <Card hoverable clickable onClick={handler}>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Actions</Card.Footer>
 * </Card>
 */

const paddingVariants = {
  none: 'p-0',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const Card = ({
  children,
  hoverable = false,
  clickable = false,
  onClick,
  padding = 'default',
  className,
  ...props
}) => {
  const isInteractive = hoverable || clickable || onClick;

  return (
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
        'bg-white rounded-soft shadow-soft overflow-hidden',
        'transition-all duration-normal',
        
        // Padding
        paddingVariants[padding],
        
        // Interactive states
        isInteractive && 'cursor-pointer',
        hoverable && 'hover:shadow-medium hover:-translate-y-1',
        onClick && 'focus-ring',
        
        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components
Card.Header = ({ children, className, ...props }) => (
  <div
    className={cn(
      'border-b border-gray-100 pb-4 mb-4',
      'text-title-md font-bold text-charcoal',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

Card.Body = ({ children, className, ...props }) => (
  <div className={cn('text-body-md text-charcoal', className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className, ...props }) => (
  <div
    className={cn(
      'border-t border-gray-100 pt-4 mt-4',
      'flex items-center gap-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;

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