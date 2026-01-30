import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Detect reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Detect mobile device
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Get animation duration based on preferences
export const getAnimDuration = (duration: number): number => {
  if (prefersReducedMotion()) return 0;
  if (isMobile()) return duration * 0.7; // Faster on mobile
  return duration;
};

// Fade in animation
export const fadeIn = (
  element: gsap.TweenTarget,
  options: gsap.TweenVars = {}
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: getAnimDuration(0.8),
    ease: 'power3.out',
    ...options,
  });
};

// Fade in with stagger
export const fadeInStagger = (
  elements: gsap.TweenTarget,
  options: gsap.TweenVars = {}
): gsap.core.Tween => {
  return gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration: getAnimDuration(0.6),
    stagger: isMobile() ? 0.05 : 0.1,
    ease: 'power3.out',
    ...options,
  });
};

// Scale in animation
export const scaleIn = (
  element: gsap.TweenTarget,
  options: gsap.TweenVars = {}
): gsap.core.Tween => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: getAnimDuration(0.6),
    ease: 'back.out(1.4)',
    ...options,
  });
};

// Slide in from direction
export const slideIn = (
  element: gsap.TweenTarget,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  options: gsap.TweenVars = {}
): gsap.core.Tween => {
  const directionMap = {
    left: { x: -100 },
    right: { x: 100 },
    top: { y: -100 },
    bottom: { y: 100 },
  };

  return gsap.from(element, {
    ...directionMap[direction],
    opacity: 0,
    duration: getAnimDuration(0.8),
    ease: 'power3.out',
    ...options,
  });
};

// Counter animation
export const animateCounter = (
  element: HTMLElement,
  endValue: number,
  options: {
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
  } = {}
): gsap.core.Tween => {
  const { duration = 2, decimals = 0, prefix = '', suffix = '' } = options;
  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration: getAnimDuration(duration),
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = prefix + obj.value.toFixed(decimals) + suffix;
    },
  });
};

// Text reveal (split characters)
export const splitTextReveal = (
  element: gsap.TweenTarget,
  options: gsap.TweenVars = {}
): gsap.core.Timeline => {
  const tl = gsap.timeline();
  const chars = (element as HTMLElement).textContent?.split('') || [];
  const charElements: HTMLSpanElement[] = [];

  // Wrap each character in a span
  if (element instanceof HTMLElement) {
    element.innerHTML = '';
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      element.appendChild(span);
      charElements.push(span);
    });

    tl.to(charElements, {
      opacity: 1,
      y: 0,
      duration: getAnimDuration(0.05),
      stagger: isMobile() ? 0.01 : 0.03,
      ease: 'power2.out',
      ...options,
    });
  }

  return tl;
};

// Parallax scroll effect
export const parallaxScroll = (
  element: gsap.TweenTarget,
  options: {
    speed?: number;
    start?: string;
    end?: string;
  } = {}
): ScrollTrigger => {
  const { speed = 0.5, start = 'top bottom', end = 'bottom top' } = options;

  if (prefersReducedMotion()) {
    return ScrollTrigger.create({ trigger: element as Element });
  }

  return ScrollTrigger.create({
    trigger: element as Element,
    start,
    end,
    scrub: true,
    onUpdate: (self) => {
      const yPos = self.progress * 100 * speed;
      gsap.set(element, { y: yPos });
    },
  });
};

// Scroll-triggered fade in
export const scrollFadeIn = (
  element: gsap.TweenTarget,
  options: gsap.TweenVars & { triggerElement?: Element } = {}
): ScrollTrigger => {
  const { triggerElement, ...tweenOptions } = options;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return ScrollTrigger.create({ trigger: (triggerElement || element) as Element });
  }

  return ScrollTrigger.create({
    trigger: (triggerElement || element) as Element,
    start: 'top 80%',
    onEnter: () => fadeIn(element, tweenOptions),
    once: true,
  });
};

// Scroll-triggered stagger
export const scrollStagger = (
  elements: gsap.TweenTarget,
  options: gsap.TweenVars & { triggerElement?: Element } = {}
): ScrollTrigger => {
  const { triggerElement, ...tweenOptions } = options;

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return ScrollTrigger.create({ trigger: (triggerElement || elements) as Element });
  }

  return ScrollTrigger.create({
    trigger: (triggerElement || elements) as Element,
    start: 'top 80%',
    onEnter: () => fadeInStagger(elements, tweenOptions),
    once: true,
  });
};

// Magnetic button effect (desktop only)
export const magneticButton = (button: HTMLElement, strength: number = 0.3): void => {
  if (isMobile() || prefersReducedMotion()) return;

  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);
};

// Gradient morphing animation
export const morphGradient = (
  element: HTMLElement,
  colors: string[],
  duration: number = 3
): gsap.core.Timeline => {
  if (prefersReducedMotion()) return gsap.timeline();

  const tl = gsap.timeline({ repeat: -1, yoyo: true });

  colors.forEach((color, index) => {
    tl.to(element, {
      background: color,
      duration: getAnimDuration(duration),
      ease: 'sine.inOut',
    }, index * duration);
  });

  return tl;
};

// 3D tilt effect on hover
export const tilt3D = (element: HTMLElement, maxTilt: number = 15): void => {
  if (isMobile() || prefersReducedMotion()) return;

  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const tiltX = (y - 0.5) * maxTilt;
    const tiltY = (x - 0.5) * -maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
};

// Modal entrance/exit animations
export const modalEnter = (
  modal: HTMLElement,
  backdrop?: HTMLElement
): gsap.core.Timeline => {
  const tl = gsap.timeline();

  if (backdrop) {
    tl.from(backdrop, {
      opacity: 0,
      duration: getAnimDuration(0.3),
      ease: 'power2.out',
    }, 0);
  }

  tl.from(modal, {
    scale: 0.8,
    opacity: 0,
    y: 50,
    duration: getAnimDuration(0.4),
    ease: 'back.out(1.4)',
  }, 0.1);

  return tl;
};

export const modalExit = (
  modal: HTMLElement,
  backdrop?: HTMLElement
): gsap.core.Timeline => {
  const tl = gsap.timeline();

  tl.to(modal, {
    scale: 0.8,
    opacity: 0,
    y: 50,
    duration: getAnimDuration(0.3),
    ease: 'power2.in',
  }, 0);

  if (backdrop) {
    tl.to(backdrop, {
      opacity: 0,
      duration: getAnimDuration(0.2),
      ease: 'power2.in',
    }, 0.1);
  }

  return tl;
};

// Cleanup ScrollTrigger instances
export const cleanupScrollTriggers = (): void => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

// Refresh ScrollTrigger (useful after DOM changes)
export const refreshScrollTrigger = (): void => {
  ScrollTrigger.refresh();
};

export default {
  fadeIn,
  fadeInStagger,
  scaleIn,
  slideIn,
  animateCounter,
  splitTextReveal,
  parallaxScroll,
  scrollFadeIn,
  scrollStagger,
  magneticButton,
  morphGradient,
  tilt3D,
  modalEnter,
  modalExit,
  prefersReducedMotion,
  isMobile,
  getAnimDuration,
  cleanupScrollTriggers,
  refreshScrollTrigger,
};
