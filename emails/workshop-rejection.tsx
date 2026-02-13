import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";
import { Signature } from "./components/signature";

interface WorkshopRejectionEmailProps {
  businessName: string;
  reason?: string;
}

export default function WorkshopRejectionEmail({
  businessName,
  reason,
}: WorkshopRejectionEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                Regarding Your Workshop Application
              </Heading>
              <Text className="mb-3.75 text-base">Dear {businessName},</Text>
              <Text className="mb-3.75 text-base">
                Thank you for your interest in participating in the Chef&apos;s
                Kiss Festival and for taking the time to submit your workshop
                application.
              </Text>

              <Text className="mb-3.75 text-base">
                After careful consideration, we regret to inform you that we are
                unable to accept your application at this time.
              </Text>
              {reason && <Text className="mb-3.75 text-base">{reason}</Text>}

              {/* <Text className="mb-3.75 text-base">
                We truly appreciate your interest in the Chef&apos;s Kiss Food
                Festival.
              </Text> */}

              <Signature closing="Warm regards" />
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WorkshopRejectionEmail.PreviewProps = {
  businessName: "[Workshop Business Name]",
  reason: `

  `,
} as WorkshopRejectionEmailProps;
