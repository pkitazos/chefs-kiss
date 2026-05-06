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
import { Header } from "./components/header";
import { Signature } from "./components/signature";

interface BookingConfirmationEmailProps {
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  seats: number;
  totalFormatted: string;
}

export default function BookingConfirmationEmail({
  fullName,
  bookingId,
  type,
  sessionTitle,
  sessionDate,
  sessionTime,
  seats,
  totalFormatted,
}: BookingConfirmationEmailProps) {
  const typeLabel = type === "private-dining" ? "Private Dining" : "Workshop";

  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Header />
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                Booking Confirmed!
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                Your {typeLabel.toLowerCase()} booking for the Chef&apos;s Kiss
                Festival has been confirmed. We look forward to seeing you!
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

BookingConfirmationEmail.PreviewProps = {
  baseUrl: "http://localhost:3000",
  fullName: "John Doe",
  bookingId: "26BK01AYN",
  type: "private-dining",
  sessionTitle: "Private Dining Experience",
  sessionDate: "Saturday, May 16",
  sessionTime: "19:00 - 21:00",
  seats: 2,
  totalFormatted: "\u20AC240.00",
} as BookingConfirmationEmailProps;
