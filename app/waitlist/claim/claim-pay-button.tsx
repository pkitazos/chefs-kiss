"use client";

import { IconCreditCard, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";

interface ClaimPayButtonProps {
  entryId: string;
  token: string;
}

export function ClaimPayButton({ entryId, token }: ClaimPayButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initPayment = api.waitlist.initPayment.useMutation({
    onSuccess: (data) => {
      window.location.href = data.paymentUrl;
    },
    onError: (error) => {
      toast.error("Could not start payment", { description: error.message });
      setIsSubmitting(false);
    },
  });

  const handleClick = () => {
    setIsSubmitting(true);
    initPayment.mutate({ waitlistEntryId: entryId, token });
  };

  return (
    <Button
      type="button"
      size="cta"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <IconLoader2 className="animate-spin" />
          Redirecting…
        </>
      ) : (
        <>
          <IconCreditCard />
          Pay now
        </>
      )}
    </Button>
  );
}
