// components/BackToTop/BackToTop.jsx
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = ({ 
  threshold = 300, 
  smooth = true, 
  position = 'bottom-right',
  backgroundColor = 'bg-orange-500',
  hoverColor = 'hover:bg-orange-600',
  iconColor = 'text-white',
  size = 'md'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Position classes mapping
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  // Size classes mapping
  const sizeClasses = {
    'sm': 'p-2 w-10 h-10',
    'md': 'p-3 w-12 h-12',
    'lg': 'p-4 w-14 h-14'
  };

  useEffect(() => {
    // Function to toggle button visibility based on scroll position
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Clear the listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed ${positionClasses[position]} ${sizeClasses[size]} ${backgroundColor} ${hoverColor} rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-110`}
          aria-label="Back to top"
        >
          <ChevronUp className={`${iconColor}`} />
        </button>
      )}
    </>
  );
};

export default BackToTop;