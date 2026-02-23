"use client";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";

type FadeUpWrapperProps = {
  delay: number;
  children: React.ReactNode;
  className?: string;
};

function FadeUpWrapper({ delay, children, className }: FadeUpWrapperProps) {
  const ref = useFadeUpOnScroll<HTMLDivElement>(delay);

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}

export default FadeUpWrapper;
