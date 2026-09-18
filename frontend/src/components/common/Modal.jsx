import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const Modal = ({
    isOpen,
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
  useEffectEvent(() => {
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
}

export default Modal;