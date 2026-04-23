import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ImagePlaceholderProps {
  className?: string;
  children?: ReactNode;
}

export function ImagePlaceholder({
  className,
  children,
}: ImagePlaceholderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {children}
    </div>
  );
}
