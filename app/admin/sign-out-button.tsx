"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        signOut();
        router.replace("/login");
      }}
      variant="outline"
    >
      <IconLogout className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}
