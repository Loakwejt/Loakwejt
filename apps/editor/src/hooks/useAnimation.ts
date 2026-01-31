import { useEffect, useRef, useState, useCallback } from 'react';
import type { BuilderAnimation } from '@builderly/core';
import { getAnimationCSS } from '@builderly/core';

interface UseAnimationOptions {
  animation?: BuilderAnimation;
  isPreviewMode?: boolean;
}

interface AnimationStyles {
  style: React.CSSProperties;
  className: string;
  ref: React.RefObject<HTMLElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

/**
 * Hook to handle scroll-triggered and interaction-triggered animations
 */
export function useAnimation({ 
  animation, 
  isPreviewMode = false 
}: UseAnimationOptions): AnimationStyles {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Reset animation state when animation config changes
  useEffect(() => {
    setHasAnimated(false);
    setIsVisible(false);
    setIsHovered(false);
    setIsClicked(false);
  }, [animation?.type, animation?.trigger]);

  // Scroll-based visibility detection
  useEffect(() => {
    if (!animation || animation.type === 'none' || !isPreviewMode) {
      return;
    }

    if (animation.trigger !== 'onScroll' && animation.trigger !== 'onLoad') {
      return;
    }

    // For onLoad, just set visible immediately
    if (animation.trigger === 'onLoad') {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const scrollOffset = animation.scrollOffset ?? 20;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        
        if (entry.isIntersecting) {
          if (!hasAnimated || animation.repeat) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (animation.repeat) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${scrollOffset}% 0px`,
      }
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [animation, isPreviewMode, hasAnimated]);

  // Get CSS for this animation
  const animationCSS = animation && animation.type !== 'none' 
    ? getAnimationCSS(animation) 
    : null;

  // Determine if animation should be active
  const isAnimationActive = (() => {
    if (!animation || animation.type === 'none' || !isPreviewMode) {
      return false;
    }

    switch (animation.trigger) {
      case 'onScroll':
      case 'onLoad':
        return isVisible;
      case 'onHover':
        return isHovered;
      case 'onClick':
        return isClicked;
      default:
        return false;
    }
  })();

  // Build final styles
  const style: React.CSSProperties = {};
  let className = '';

  if (animationCSS && isPreviewMode && animation && animation.type !== 'none') {
    // Apply initial or animated styles based on state
    if (isAnimationActive) {
      Object.assign(style, animationCSS.animatedStyle);
    } else {
      Object.assign(style, animationCSS.initialStyle);
    }
    
    // Add keyframes if needed (via a style tag would be better but this works for now)
    if (animationCSS.keyframes && isAnimationActive) {
      className = 'animated';
    }
  }

  // Handlers for hover/click triggers
  const handleMouseEnter = useCallback(() => {
    if (animation?.trigger === 'onHover') {
      setIsHovered(true);
    }
  }, [animation?.trigger]);

  const handleMouseLeave = useCallback(() => {
    if (animation?.trigger === 'onHover') {
      setIsHovered(false);
    }
  }, [animation?.trigger]);

  const handleClick = useCallback(() => {
    if (animation?.trigger === 'onClick') {
      setIsClicked(true);
      // Reset after animation completes
      setTimeout(() => {
        setIsClicked(false);
      }, animation.duration + animation.delay);
    }
  }, [animation?.trigger, animation?.duration, animation?.delay]);

  return {
    style,
    className,
    ref: ref as React.RefObject<HTMLElement>,
    onMouseEnter: animation?.trigger === 'onHover' ? handleMouseEnter : undefined,
    onMouseLeave: animation?.trigger === 'onHover' ? handleMouseLeave : undefined,
    onClick: animation?.trigger === 'onClick' ? handleClick : undefined,
  };
}

/**
 * Inject animation keyframes into the document
 */
export function injectAnimationKeyframes() {
  if (typeof document === 'undefined') return;
  
  const styleId = 'builderly-animation-keyframes';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes swing {
      20% { transform: rotate3d(0, 0, 1, 15deg); }
      40% { transform: rotate3d(0, 0, 1, -10deg); }
      60% { transform: rotate3d(0, 0, 1, 5deg); }
      80% { transform: rotate3d(0, 0, 1, -5deg); }
      100% { transform: rotate3d(0, 0, 1, 0deg); }
    }
    @keyframes tada {
      0% { transform: scale3d(1, 1, 1); }
      10%, 20% { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); }
      30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }
      40%, 60%, 80% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }
      100% { transform: scale3d(1, 1, 1); }
    }
  `;
  document.head.appendChild(style);
}
