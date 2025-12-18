import { AuthExample } from "@/components/auth-example";
import { TRPCExample } from "@/components/trpc-example";
import { FormExample } from "@/components/form-example";

export default function Page() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Chefs Kiss</h1>
        <p className="text-lg text-muted-foreground">
          A production-ready Next.js stack with authentication, type-safe APIs, and modern tooling
        </p>
      </div>

      <AuthExample />
      <TRPCExample />
      <FormExample />
    </div>
  );
}