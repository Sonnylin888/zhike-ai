"use client";

import React, {
  createElement,
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";

type MotionValue = {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
};

type MotionProps = {
  initial?: MotionValue;
  animate?: MotionValue;
  exit?: MotionValue;
  transition?: {
    delay?: number;
    duration?: number;
    ease?: string;
  };
  whileInView?: MotionValue;
  viewport?: unknown;
};

type MotionElementProps<T extends keyof React.JSX.IntrinsicElements> =
  React.JSX.IntrinsicElements[T] & MotionProps;

function toStyle(value?: MotionValue): CSSProperties {
  if (!value) return {};
  const transforms = [
    typeof value.x === "number" ? `translateX(${value.x}px)` : "",
    typeof value.y === "number" ? `translateY(${value.y}px)` : "",
    typeof value.scale === "number" ? `scale(${value.scale})` : ""
  ].filter(Boolean);

  return {
    opacity: value.opacity,
    transform: transforms.length ? transforms.join(" ") : undefined
  };
}

function createMotion<T extends keyof React.JSX.IntrinsicElements>(tag: T) {
  return forwardRef<HTMLElement, MotionElementProps<T>>(function MotionElement(
    {
      initial,
      animate,
      exit: _exit,
      transition,
      whileInView,
      viewport: _viewport,
      style,
      ...props
    },
    ref
  ) {
    const target = animate || whileInView;
    const [motionStyle, setMotionStyle] = useState<CSSProperties>(() =>
      toStyle(initial)
    );
    const cssTransition = useMemo(() => {
      const duration = transition?.duration ?? 0.36;
      return `opacity ${duration}s ease, transform ${duration}s ease`;
    }, [transition?.duration]);

    useEffect(() => {
      const frame = window.requestAnimationFrame(() => {
        setMotionStyle(toStyle(target));
      });
      return () => window.cancelAnimationFrame(frame);
    }, [target?.opacity, target?.x, target?.y, target?.scale]);

    return createElement(tag, {
      ...props,
      ref,
      style: {
        ...style,
        ...motionStyle,
        transition: cssTransition,
        transitionDelay: transition?.delay ? `${transition.delay}s` : undefined
      }
    });
  });
}

export function AnimatePresence({ children }: { children: ReactNode; mode?: string }) {
  return <>{children}</>;
}

export const motion = {
  article: createMotion("article"),
  div: createMotion("div"),
  h2: createMotion("h2"),
  li: createMotion("li")
};
