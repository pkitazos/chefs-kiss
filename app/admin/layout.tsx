import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { SignOutButton } from "./sign-out-button";
import { AdminNav } from "./admin-nav";
import Image from "next/image";

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
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 flex-row">
            <Image
              src="/favicon.svg"
              alt=""
              width={120}
              height={40}
              className="size-6 -mt-1"
            />
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
          <AdminNav />
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <SignOutButton />
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
