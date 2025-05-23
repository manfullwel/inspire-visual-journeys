
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<Element | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        // Once the element has been intersected once, we remember that
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin, root }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, root, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
}
