import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Signature } from "./components/signature";

interface WaitlistPaymentConfirmationEmailProps {
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  slotLabel: string;
  seats: number;
  totalFormatted: string;
}

export default function WaitlistPaymentConfirmationEmail({
  fullName,
  bookingId,
  type,
  slotLabel,
  seats,
  totalFormatted,
}: WaitlistPaymentConfirmationEmailProps) {
  const typeLabel = type === "private-dining" ? "Private Dining" : "Workshop";

  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                You&apos;re in!
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                Great news - your spot for {slotLabel} is secured!
              </Text>

              <Section className="my-5 rounded-md bg-white p-5">
                <Heading as="h2" className="mt-0 text-lg text-[#2c3e50]">
                  Booking Details
                </Heading>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Booking ID:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {bookingId}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Type:</td>
                      <td className="py-2 text-sm font-semibold">
                        {typeLabel}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Session:</td>
                      <td className="py-2 text-sm font-semibold">
                        {slotLabel}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Seats:</td>
                      <td className="py-2 text-sm font-semibold">{seats}</td>
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

              <Text className="mb-3.75 text-base">
                If you have any questions, please don&apos;t hesitate to reach
                out to us at{" "}
                <span className="text-[#98244c]">info@chefskiss.com.cy</span>.
              </Text>

              <Signature />
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WaitlistPaymentConfirmationEmail.PreviewProps = {
  fullName: "Jane Doe",
  bookingId: "26BK02AYN",
  type: "private-dining",
  slotLabel: "Private Dining Experience - Saturday, May 16 at 19:00",
  seats: 2,
  totalFormatted: "€240.00",
} as WaitlistPaymentConfirmationEmailProps;
