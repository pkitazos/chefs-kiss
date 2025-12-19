import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SectionLabel - Small overline/eyebrow label component
 *
 * Used for category labels or section identifiers above main headings
 * Based on "Header" typography from brand guidelines:
 * - Manrope Extrabold
 * - 10pt, +2pt leading
 * - Tracking 100 (wide letter spacing)
 * - Typically used in ALL CAPS
 *
 * @example
 * <SectionLabel>About Us</SectionLabel>
 * <h1>Welcome to Chef's Kiss</h1>
 */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span className={cn("text-brand-header text-muted-foreground", className)}>
      {children}
    </span>
  );
}