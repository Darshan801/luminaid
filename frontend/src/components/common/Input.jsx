import { cn } from "../../utils/cn";

/**
 * Reusable Input Component with validation and accessibility
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {'text'|'email'|'password'|'number'|'tel'|'url'} props.type - Input type
 * @param {string} props.name - Input name attribute
 * @param {string} props.id - Input id (auto-generated from name if not provided)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below input
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.leftIcon - Icon on the left side
 * @param {React.ReactNode} props.rightIcon - Icon on the right side
 * @param {string} props.className - Additional classes for input
 * @param {string} props.containerClassName - Additional classes for container
 */


const Input = ({
    label , type='text' , name , id, value , onChange , onBlur , placeholder ,
    error , helperText , required=false , disabled=false , leftIcon , rightIcon ,
    className , containerClassName ,
    ...props
}) => {
    const inputId = id || name ;

    return (
        <div className={cn('w-full', containerClassName)}>
            {/* Label */}
            {label && (
                <label htmlFor={inputId}
                className="block text-sm font-medium text-black mb-2"
                >
                    {label}
                    {required && <span className="text-primary-red ml-1" aria-label="required">*</span>}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative">
                {/* left Icon */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                {/* Input */}
                <input
                    type={type}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                    }
                    className={cn(
                        // Base styles
                        'w-full px-4 py-3',
                        'border-2 rounded-md',
                        'text-black placeholder:text-gray-medium',
                        'transition-all duration-200',
                        
                        // Focus styles
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        
                        // Normal state
                        !error && 'border-gray-300 focus:border-primary-red focus:ring-primary-red/20',
                        
                        // Error state
                        error && 'border-primary-red focus:border-primary-red focus:ring-primary-red/20',
                        
                        // Disabled state
                        'disabled:bg-gray-light disabled:cursor-not-allowed disabled:opacity-60',
                        
                        // With icons padding
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        
                        // Custom classes
                        className
                    )}
                    {...props}
                />

                {/* Right icon */}
                {rightIcon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium">
                    {rightIcon}
                </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p
                id={`${inputId}-error`}
                className="mt-1.5 text-sm text-primary-red flex items-center gap-1"
                role="alert"
                >
                <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                    />
                </svg>
                {error}
                </p>
            )}

            {/* Helper text */}
            {!error && helperText && (
                <p
                id={`${inputId}-helper`}
                className="mt-1.5 text-sm text-gray-medium"
                >
                {helperText}
                </p>
            )}
            </div>
        );
    };
export default Input;
                
            