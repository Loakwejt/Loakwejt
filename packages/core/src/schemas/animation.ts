import { z } from 'zod';

// ============================================================================
// ANIMATION TYPES
// ============================================================================

/**
 * Animation trigger - when the animation should start
 */
export const AnimationTriggerSchema = z.enum([
  'onLoad',      // When the element loads/appears
  'onScroll',    // When element enters viewport
  'onHover',     // On mouse hover
  'onClick',     // On click
]);

export type AnimationTrigger = z.infer<typeof AnimationTriggerSchema>;

/**
 * Animation preset types
 */
export const AnimationTypeSchema = z.enum([
  // Entrance animations
  'fadeIn',
  'fadeInUp',
  'fadeInDown',
  'fadeInLeft',
  'fadeInRight',
  'slideInUp',
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'scaleIn',
  'scaleInUp',
  'scaleInDown',
  // Attention seekers
  'pulse',
  'bounce',
  'shake',
  'swing',
  'tada',
  // Exit animations (for hover out, etc.)
  'fadeOut',
  'fadeOutUp',
  'fadeOutDown',
  // Custom
  'none',
]);

export type AnimationType = z.infer<typeof AnimationTypeSchema>;

/**
 * Easing functions
 */
export const AnimationEasingSchema = z.enum([
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'ease-in-back',
  'ease-out-back',
  'ease-in-out-back',
]);

export type AnimationEasing = z.infer<typeof AnimationEasingSchema>;

// ============================================================================
// ANIMATION DEFINITION
// ============================================================================

export const BuilderAnimationSchema = z.object({
  // Which animation to use
  type: AnimationTypeSchema,
  
  // When to trigger
  trigger: AnimationTriggerSchema,
  
  // Timing
  duration: z.number().min(0).max(5000), // ms
  delay: z.number().min(0).max(5000), // ms
  
  // Easing
  easing: AnimationEasingSchema,
  
  // Scroll-specific options
  scrollOffset: z.number().min(0).max(100).optional(), // % from bottom when to trigger
  
  // Repeat options
  repeat: z.boolean().optional(), // Replay when scrolling back
  
  // Hover-specific
  hoverOut: AnimationTypeSchema.optional(), // Animation on hover out
});

export type BuilderAnimation = z.infer<typeof BuilderAnimationSchema>;

// ============================================================================
// DEFAULT ANIMATION
// ============================================================================

export const defaultAnimation: BuilderAnimation = {
  type: 'none',
  trigger: 'onScroll',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  scrollOffset: 20,
  repeat: false,
};

// ============================================================================
// ANIMATION PRESETS - Quick selections for users
// ============================================================================

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  animation: Partial<BuilderAnimation>;
}

export const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    id: 'none',
    name: 'Keine Animation',
    description: 'Keine Animation',
    animation: { type: 'none' },
  },
  {
    id: 'fade-in-scroll',
    name: 'Einblenden',
    description: 'Sanftes Einblenden beim Scrollen',
    animation: { type: 'fadeIn', trigger: 'onScroll', duration: 600 },
  },
  {
    id: 'fade-in-up-scroll',
    name: 'Einblenden von unten',
    description: 'Erscheint mit Bewegung nach oben',
    animation: { type: 'fadeInUp', trigger: 'onScroll', duration: 600 },
  },
  {
    id: 'fade-in-left-scroll',
    name: 'Einblenden von links',
    description: 'Erscheint mit Bewegung von links',
    animation: { type: 'fadeInLeft', trigger: 'onScroll', duration: 600 },
  },
  {
    id: 'fade-in-right-scroll',
    name: 'Einblenden von rechts',
    description: 'Erscheint mit Bewegung von rechts',
    animation: { type: 'fadeInRight', trigger: 'onScroll', duration: 600 },
  },
  {
    id: 'scale-in-scroll',
    name: 'Vergrößern',
    description: 'Wächst sanft auf volle Größe',
    animation: { type: 'scaleIn', trigger: 'onScroll', duration: 500, easing: 'ease-out-back' },
  },
  {
    id: 'slide-in-up',
    name: 'Hochschieben',
    description: 'Schiebt von unten nach oben',
    animation: { type: 'slideInUp', trigger: 'onScroll', duration: 500 },
  },
  {
    id: 'bounce-hover',
    name: 'Bounce (Hover)',
    description: 'Springt bei Hover',
    animation: { type: 'bounce', trigger: 'onHover', duration: 800 },
  },
  {
    id: 'pulse-hover',
    name: 'Pulsieren (Hover)',
    description: 'Pulsiert bei Hover',
    animation: { type: 'pulse', trigger: 'onHover', duration: 600 },
  },
  {
    id: 'scale-hover',
    name: 'Vergrößern (Hover)',
    description: 'Vergrößert bei Hover',
    animation: { type: 'scaleIn', trigger: 'onHover', duration: 200, easing: 'ease-out' },
  },
];

// ============================================================================
// CSS KEYFRAME GENERATOR
// ============================================================================

/**
 * CSS properties type (compatible with React.CSSProperties)
 */
export type CSSStyleProperties = {
  [key: string]: string | number | undefined;
};

/**
 * Returns the CSS animation class name and keyframes for an animation type
 */
export function getAnimationCSS(animation: BuilderAnimation): {
  initialStyle: CSSStyleProperties;
  animatedStyle: CSSStyleProperties;
  keyframes: string;
} {
  const { type, duration, delay, easing } = animation;
  
  const timingFunction = getEasingFunction(easing);
  const transitionDuration = `${duration}ms`;
  const transitionDelay = `${delay}ms`;

  switch (type) {
    case 'fadeIn':
      return {
        initialStyle: { opacity: 0 },
        animatedStyle: { 
          opacity: 1,
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'fadeInUp':
      return {
        initialStyle: { opacity: 0, transform: 'translateY(30px)' },
        animatedStyle: { 
          opacity: 1, 
          transform: 'translateY(0)',
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}, transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'fadeInDown':
      return {
        initialStyle: { opacity: 0, transform: 'translateY(-30px)' },
        animatedStyle: { 
          opacity: 1, 
          transform: 'translateY(0)',
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}, transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'fadeInLeft':
      return {
        initialStyle: { opacity: 0, transform: 'translateX(-30px)' },
        animatedStyle: { 
          opacity: 1, 
          transform: 'translateX(0)',
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}, transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'fadeInRight':
      return {
        initialStyle: { opacity: 0, transform: 'translateX(30px)' },
        animatedStyle: { 
          opacity: 1, 
          transform: 'translateX(0)',
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}, transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'slideInUp':
      return {
        initialStyle: { transform: 'translateY(100%)' },
        animatedStyle: { 
          transform: 'translateY(0)',
          transition: `transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'slideInDown':
      return {
        initialStyle: { transform: 'translateY(-100%)' },
        animatedStyle: { 
          transform: 'translateY(0)',
          transition: `transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'slideInLeft':
      return {
        initialStyle: { transform: 'translateX(-100%)' },
        animatedStyle: { 
          transform: 'translateX(0)',
          transition: `transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'slideInRight':
      return {
        initialStyle: { transform: 'translateX(100%)' },
        animatedStyle: { 
          transform: 'translateX(0)',
          transition: `transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'scaleIn':
      return {
        initialStyle: { opacity: 0, transform: 'scale(0.8)' },
        animatedStyle: { 
          opacity: 1, 
          transform: 'scale(1)',
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}, transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'scaleInUp':
      return {
        initialStyle: { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
        animatedStyle: { 
          opacity: 1, 
          transform: 'scale(1) translateY(0)',
          transition: `opacity ${transitionDuration} ${timingFunction} ${transitionDelay}, transform ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: '',
      };
    
    case 'pulse':
      return {
        initialStyle: {},
        animatedStyle: { 
          animation: `pulse ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: `@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`,
      };
    
    case 'bounce':
      return {
        initialStyle: {},
        animatedStyle: { 
          animation: `bounce ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: `@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`,
      };
    
    case 'shake':
      return {
        initialStyle: {},
        animatedStyle: { 
          animation: `shake ${transitionDuration} ${timingFunction} ${transitionDelay}`,
        },
        keyframes: `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`,
      };
    
    default:
      return {
        initialStyle: {},
        animatedStyle: {},
        keyframes: '',
      };
  }
}

function getEasingFunction(easing: AnimationEasing): string {
  switch (easing) {
    case 'linear': return 'linear';
    case 'ease': return 'ease';
    case 'ease-in': return 'ease-in';
    case 'ease-out': return 'ease-out';
    case 'ease-in-out': return 'ease-in-out';
    case 'ease-in-back': return 'cubic-bezier(0.6, -0.28, 0.735, 0.045)';
    case 'ease-out-back': return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    case 'ease-in-out-back': return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    default: return 'ease-out';
  }
}
