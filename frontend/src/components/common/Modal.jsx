import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'success', 'warning', 'error', 'info', 'confirm'
  showCancel = false,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  children 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      case 'confirm':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'confirm':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10 ${
                  type === 'success' ? 'bg-green-600' : 
                  type === 'warning' ? 'bg-orange-600' : 
                  type === 'error' ? 'bg-red-600' : 
                  type === 'confirm' ? 'bg-blue-600' : 
                  'bg-gray-600'
                }`}>
                  <div className={getIconColor()}>
                    {getIcon()}
                  </div>
                </div>
              </div>

              {/* Title */}
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {title}
                </h3>
              )}

              {/* Message */}
              {message && (
                <p className="text-sm text-gray-600 text-center mb-6">
                  {message}
                </p>
              )}

              {/* Custom children */}
              {children && (
                <div className="mb-6">
                  {children}
                </div>
              )}

              {/* Buttons */}
              <div className={`flex gap-3 ${showCancel ? 'justify-between' : 'justify-center'}`}>
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`${showCancel ? 'flex-1' : 'min-w-[120px]'} px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors ${
                    type === 'success' ? 'bg-green-600 hover:bg-green-700' : 
                    type === 'warning' ? 'bg-orange-600 hover:bg-orange-700' : 
                    type === 'error' ? 'bg-red-600 hover:bg-red-700' : 
                    type === 'confirm' ? 'bg-primary-red hover:bg-dark-red' : 
                    'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
