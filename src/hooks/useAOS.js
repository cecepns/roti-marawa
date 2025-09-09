import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';

export const useAOS = () => {
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      try {
        // Always refresh AOS when route changes
        AOS.refresh();
        console.log('AOS refreshed on route change:', location.pathname);
      } catch (error) {
        console.error('AOS refresh failed on route change:', error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};
