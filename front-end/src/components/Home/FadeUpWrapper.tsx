"use client";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";

type FadeUpWrapperProps = {
  delay: number;
  children: React.ReactNode;
};

function FadeUpWrapper({ delay, children }: FadeUpWrapperProps) {
  const ref = useFadeUpOnScroll<HTMLDivElement>(delay);

  return (
    <div ref={ref} className="fade-up">
      {children}
    </div>
  );
}

export default FadeUpWrapper;
