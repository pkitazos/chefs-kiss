import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="mt-4 lg:mt-10 min-h-screen bg-background">
      <div
        className={cn(
          "mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
