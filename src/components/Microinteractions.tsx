// 🐾⚡ MICROINTERACTIONS COMPONENT LIBRARY (2025 TRENDS) ⚡🐾
// Delightful UI animations and interactions, nyaa~!

'use client';

import React, { useState, useEffect } from 'react';
import { prefersReducedMotion } from '../utils/accessibility';

// ========================================
// 1. HOVER GLOW EFFECT (Button/Card)
// ========================================
interface HoverGlowProps {
  children: React.ReactNode;
  glowColor?: string;
  intensity?: number;
}

export function HoverGlow({ children, glowColor = '#00ff88', intensity = 0.5 }: HoverGlowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = prefersReducedMotion();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        transition: reducedMotion ? 'none' : 'transform 0.2s ease',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered
          ? `0 0 20px ${glowColor}${Math.floor(intensity * 255).toString(16)}`
          : 'none',
      }}
    >
      {children}
    </div>
  );
}

// ========================================
// 2. RIPPLE EFFECT (Material Design)
// ========================================
interface RippleProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}

export function Ripple({ children, color = 'rgba(255, 255, 255, 0.5)', duration = 600 }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, duration);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: color,
            transform: 'translate(-50%, -50%)',
            animation: `ripple-animation ${duration}ms ease-out`,
            pointerEvents: 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes ripple-animation {
          to {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ========================================
// 3. TOOLTIP WITH SMOOTH TRANSITION
// ========================================
interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, text, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? 'tooltip' : undefined}
    >
      {children}
      {isVisible && (
        <div
          id="tooltip"
          role="tooltip"
          style={{
            position: 'absolute',
            ...positionStyles[position],
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            opacity: reducedMotion ? 1 : 0,
            animation: reducedMotion ? 'none' : 'tooltip-fade-in 0.2s forwards',
            pointerEvents: 'none',
          }}
        >
          {text}
        </div>
      )}
      <style>{`
        @keyframes tooltip-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ========================================
// 4. LOADING SPINNER (Neko Paw!)
// ========================================
interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export function LoadingSpinner({ size = 40, color = '#00ff88' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        border: `4px solid rgba(0, 255, 136, 0.3)`,
        borderTop: `4px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    >
      <span className="sr-only">Loading...</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ========================================
// 5. PULSE ANIMATION (for notifications)
// ========================================
interface PulseProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}

export function Pulse({ children, color = '#ff6b6b', duration = 2000 }: PulseProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <div
      style={{
        animation: reducedMotion ? 'none' : `pulse-animation ${duration}ms infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes pulse-animation {
          0%, 100% {
            box-shadow: 0 0 0 0 ${color}80;
          }
          50% {
            box-shadow: 0 0 0 10px ${color}00;
          }
        }
      `}</style>
    </div>
  );
}

// ========================================
// 6. SKELETON LOADER (Content placeholder)
// ========================================
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4 }: SkeletonProps) {
  return (
    <div
      aria-label="Loading content"
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ========================================
// 7. FADE IN ON SCROLL (Intersection Observer)
// ========================================
interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
}

export function FadeInOnScroll({ children, delay = 0 }: FadeInOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: reducedMotion ? 1 : (isVisible ? 1 : 0),
        transform: reducedMotion ? 'none' : (isVisible ? 'translateY(0)' : 'translateY(20px)'),
        transition: reducedMotion ? 'none' : 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  );
}

// ========================================
// 8. ICON TRANSITION (Smooth icon swap)
// ========================================
interface IconTransitionProps {
  fromIcon: React.ReactNode;
  toIcon: React.ReactNode;
  isActive: boolean;
}

export function IconTransition({ fromIcon, toIcon, isActive }: IconTransitionProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          opacity: isActive ? 0 : 1,
          transform: reducedMotion ? 'none' : (isActive ? 'scale(0.8) rotate(90deg)' : 'scale(1) rotate(0deg)'),
          transition: reducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {fromIcon}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: isActive ? 1 : 0,
          transform: reducedMotion ? 'none' : (isActive ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-90deg)'),
          transition: reducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {toIcon}
      </div>
    </div>
  );
}

// ========================================
// 9. NUMBER COUNTER (Animated count-up)
// ========================================
interface NumberCounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
}

export function NumberCounter({ from, to, duration = 1000, suffix = '' }: NumberCounterProps) {
  const [count, setCount] = useState(from);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(to);
      return;
    }

    const increment = (to - from) / (duration / 16);
    let current = from;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [from, to, duration, reducedMotion]);

  return <span>{count}{suffix}</span>;
}

// ========================================
// 10. BUTTON WITH LOADING STATE
// ========================================
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({ isLoading, children, ...props }: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      style={{
        position: 'relative',
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'wait' : 'pointer',
        ...props.style,
      }}
    >
      {isLoading && (
        <span style={{ marginRight: '8px' }}>
          <LoadingSpinner size={16} />
        </span>
      )}
      {children}
    </button>
  );
}
