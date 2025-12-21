import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Chef&apos;s Kiss Admin</h1>
          <p className="text-sm text-muted-foreground">
            {session.user.email}
          </p>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
