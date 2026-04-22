import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/page-layout";

interface LegalDocProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalDoc({ title, lastUpdated, children }: LegalDocProps) {
  return (
    <PageLayout className="mt-16 max-w-3xl">
      <header className="mb-10 space-y-3 border-b pb-8">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">
            Last updated:
          </strong>{" "}
          {lastUpdated}
        </p>
      </header>
      <div
        className={cn(
          "space-y-4 leading-relaxed text-muted-foreground",
          "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-foreground",
          "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-foreground",
          "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:no-underline",
          "[&_strong]:font-semibold [&_strong]:text-foreground",
          "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground",
        )}
      >
        {children}
      </div>
    </PageLayout>
  );
}
