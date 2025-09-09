import { useEffect } from 'react';

const AOSWrapper = ({ children }) => {
  useEffect(() => {
    // Function to initialize AOS
    const initAOS = () => {
      // Check if AOS is available (either from import or CDN)
      const AOSLib = window.AOS || (typeof AOS !== 'undefined' ? AOS : null);
      
      if (AOSLib) {
        try {
          AOSLib.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
            offset: 100,
            delay: 0,
          });
          
          // Refresh after a short delay
          setTimeout(() => {
            AOSLib.refresh();
            console.log('AOS initialized successfully');
          }, 200);
        } catch (error) {
          console.error('AOS initialization failed:', error);
        }
      } else {
        console.warn('AOS library not found');
      }
    };

    // Initialize AOS when component mounts
    const timer = setTimeout(initAOS, 100);

    return () => clearTimeout(timer);
  }, []);

  return children;
};

export default AOSWrapper;
