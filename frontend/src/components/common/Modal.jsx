import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size='md',
    closeOnEscape = true,
    closeOnBackdrop = true,
    showCloseButton = true,
    className,
}) => {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    // size variants
    const sizeVariants = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

//   lock body scroll when modal opens
  useEffect(() => {
    if (isOpen){
        // save current focused Element
        previousActiveElement.current = document.activeElement;

        // lock body scroll
        document.body.style.overflow = 'hidden';

        // focus modal
        modalRef.current?.focus();
    } else {
        // restoring body scroll
        document.body.style.overflow = 'unset';

        // return focus to previous Element
        previousActiveElement.current?.focus();
    }
    return () => {
        document.body.style.overflow = 'unset'
    };
  },[isOpen]);


//   handle escape key 
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
        if (e.key === 'Escape'){
            onClose();
        }
    };

    document.addEventListener('keydown',handleEscape);
    return () => document.removeEventListener('keydown',handleEscape);
  },[isOpen,closeOnEscape,onClose])

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget){
        onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
    >
        {/* backdrop  */}
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={handleBackdropClick}
            aria-hidden="true"
        ></div>
    {/* Modal container */}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal content */}
        <div
          ref={modalRef}
          tabIndex={-1}
          className={cn(
            'relative bg-white rounded-lg shadow-2xl',
            'w-full',
            'transform transition-all',
            'animate-fade-in',
            sizeVariants[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h3
                  id="modal-title"
                  className="text-xl font-semibold text-black"
                >
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'text-gray-medium hover:text-black',
                    'rounded-md p-1',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2',
                    !title && 'absolute top-4 right-4 z-10'
                  )}
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;