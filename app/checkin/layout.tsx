import type { Metadata } from "next";
import { getEnrichedSession } from "@/lib/auth";
import { userHasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { SignOutButton } from "../admin/sign-out-button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Check-in",
  robots: "noindex, nofollow",
};

export default async function CheckInLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getEnrichedSession({
    headers: await headers(),
  });

  if (!session || !userHasPermission(session.user, "check_in.access")) {
    redirect("/login?redirect=/checkin");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* todo: merge with day picker */}
      {/*<header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/favicon.svg"
            alt=""
            width={120}
            height={40}
            className="size-6 -mt-1"
          />
          <h1 className="text-xl font-semibold">Check-in</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <SignOutButton />
        </div>
      </header>*/}
      <main className="container mx-auto p-4 mb-10">{children}</main>
    </div>
  );
}
