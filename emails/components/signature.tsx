import { Text } from "@react-email/components";

interface SignatureProps {
  closing?: string;
  teamName?: string;
}

export function Signature({
  closing = "Best regards",
  teamName = "The Chef's Kiss Team",
}: SignatureProps) {
  return (
    <Text className="mt-6 text-base">
      {closing},
      <br />
      <strong>{teamName}</strong>
    </Text>
  );
}
