import { Badge } from "@/components/ui/badge";

type PaymentMethod = "online" | "in-person";

interface PaymentBadgeProps {
  paymentMethod: PaymentMethod;
  paidAt: Date | null;
}

export function PaymentBadge({ paymentMethod, paidAt }: PaymentBadgeProps) {
  if (paymentMethod === "online") {
    return (
      <Badge
        variant="outline"
        className="bg-sky-500/10 text-sky-600 border-sky-500/40"
      >
        Online
      </Badge>
    );
  }

  if (paidAt) {
    return (
      <Badge
        variant="outline"
        className="bg-green-500/10 text-green-600 border-green-500/40"
      >
        Paid (in person)
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-amber-500/15 text-amber-400 border-amber-500/50"
    >
      Pay on the day
    </Badge>
  );
}
