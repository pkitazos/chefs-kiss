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

interface WaitlistPromotionEmailProps {
  fullName: string;
  bookingId: string;
  slotLabel: string;
  partySize: number;
}

export default function WaitlistPromotionEmail({
  fullName,
  bookingId,
  slotLabel,
  partySize,
}: WaitlistPromotionEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                A spot just opened up for you
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                Good news — a seat has become available for {slotLabel} and
                we&apos;ve reserved it for your party of {partySize}.
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
                      <td className="py-2 text-sm text-gray-500">Session:</td>
                      <td className="py-2 text-sm font-semibold">
                        {slotLabel}
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
                      <td className="py-2 text-sm text-gray-500">Payment:</td>
                      <td className="py-2 text-sm font-semibold">
                        Pay on arrival at the event (cash or card)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Text className="mb-3.75 text-base">
                You don&apos;t need to do anything else online. Show your
                booking ID at the entrance. If you can no longer attend, reply
                to this email so we can offer the seat to the next person on
                the list.
              </Text>

              <Text className="mb-3.75 text-base">
                If you have any questions, please reach out to us at{" "}
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

WaitlistPromotionEmail.PreviewProps = {
  fullName: "Jane Doe",
  bookingId: "26BK02AYN",
  slotLabel: "Private Dining Experience - Saturday, May 16 at 19:00",
  partySize: 2,
} as WaitlistPromotionEmailProps;
