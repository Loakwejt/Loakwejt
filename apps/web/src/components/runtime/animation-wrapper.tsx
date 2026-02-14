'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { BuilderAnimation } from '@builderly/core';
import { getAnimationCSS } from '@builderly/core';

interface RuntimeAnimationWrapperProps {
  animation?: BuilderAnimation;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Client-side animation wrapper for runtime rendered pages
 * Handles scroll-triggered, hover, click, and load animations
 */
export function RuntimeAnimationWrapper({
  animation,
  children,
  className = '',
  style: propStyle = {},
}: RuntimeAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Reset animation state when config changes
  useEffect(() => {
    setHasAnimated(false);
    setIsVisible(false);
    setIsHovered(false);
    setIsClicked(false);
  }, [animation?.type, animation?.trigger]);

  // Scroll/Load detection
  useEffect(() => {
    if (!animation || animation.type === 'none') {
      return;
    }

    if (animation.trigger !== 'onScroll' && animation.trigger !== 'onLoad') {
      return;
    }

    // For onLoad, set visible immediately after a frame
    if (animation.trigger === 'onLoad') {
      requestAnimationFrame(() => setIsVisible(true));
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
  }, [animation, hasAnimated]);

  // Get animation CSS
  const animationCSS = animation && animation.type !== 'none' 
    ? getAnimationCSS(animation) 
    : null;

  // Determine if active
  const isActive = (() => {
    if (!animation || animation.type === 'none') {
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

  // Build styles
  const combinedStyle: React.CSSProperties = { ...propStyle };

  if (animationCSS && animation && animation.type !== 'none') {
    if (isActive) {
      Object.assign(combinedStyle, animationCSS.animatedStyle);
    } else {
      Object.assign(combinedStyle, animationCSS.initialStyle);
    }
  }

  // Handlers
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

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (animation?.trigger === 'onClick') {
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, (animation.duration || 500) + (animation.delay || 0));
    }
  }, [animation?.trigger, animation?.duration, animation?.delay]);

  // No animation - just render children
  if (!animation || animation.type === 'none') {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={combinedStyle}
      onMouseEnter={animation.trigger === 'onHover' ? handleMouseEnter : undefined}
      onMouseLeave={animation.trigger === 'onHover' ? handleMouseLeave : undefined}
      onClick={animation.trigger === 'onClick' ? handleClick : undefined}
    >
      {children}
    </div>
  );
}
