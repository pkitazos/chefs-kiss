import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Header } from "./components/header";
import { Signature } from "./components/signature";

interface WaitlistPromotionEmailProps {
  baseUrl: string;
  fullName: string;
  claimUrl: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  partySize: number;
  totalFormatted: string;
}

export default function WaitlistPromotionEmail({
  baseUrl,
  fullName,
  claimUrl,
  sessionTitle,
  sessionDate,
  sessionTime,
  partySize,
  totalFormatted,
}: WaitlistPromotionEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Header baseUrl={baseUrl} />
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                A spot just opened up for you
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                We&apos;ve reserved your seat for {sessionTitle}. To confirm,
                complete your payment using the link below.
              </Text>

              <Section className="my-5 rounded-md bg-white p-5">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Experience:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {sessionTitle}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Date:</td>
                      <td className="py-2 text-sm font-semibold">
                        {sessionDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Time:</td>
                      <td className="py-2 text-sm font-semibold">
                        {sessionTime}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Party size:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {partySize}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Total:</td>
                      <td className="py-2 text-sm font-semibold">
                        {totalFormatted}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Section className="my-6 text-center">
                <Button
                  href={claimUrl}
                  className="rounded-md bg-[#c42353] px-8 py-3 text-base font-semibold text-white"
                >
                  Pay now and confirm your seat
                </Button>
              </Section>

              <Text className="mb-3.75 text-base">
                Clicking the button opens our secure payment page. Your spot is
                held until you complete payment.
              </Text>

              <Signature />
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WaitlistPromotionEmail.PreviewProps = {
  baseUrl: "http://localhost:3000",
  fullName: "Jane Doe",
  claimUrl: "http://localhost:3000/waitlist/claim?id=26WL02AYN",
  sessionTitle: "Private Dining Experience",
  sessionDate: "Saturday, May 16",
  sessionTime: "19:00 - 21:00",
  partySize: 2,
  totalFormatted: "€240.00",
} as WaitlistPromotionEmailProps;
