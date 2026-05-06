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

interface BookingCancellationEmailProps {
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  seats: number;
}

export default function BookingCancellationEmail({
  fullName,
  bookingId,
  type,
  sessionTitle,
  sessionDate,
  sessionTime,
  seats,
}: BookingCancellationEmailProps) {
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
                Booking Cancelled
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                Your {typeLabel.toLowerCase()} booking for the Chef&apos;s Kiss
                Festival has been cancelled.
              </Text>

              <Section className="my-5 rounded-md bg-white p-5">
                <Heading as="h2" className="mt-0 text-lg text-[#2c3e50]">
                  Cancelled Booking
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
                  </tbody>
                </table>
              </Section>

              <Text className="mb-3.75 text-base">
                If you believe this was a mistake, or you have any questions
                about a refund, please reach out to us at{" "}
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

BookingCancellationEmail.PreviewProps = {
  baseUrl: "http://localhost:3000",
  fullName: "John Doe",
  bookingId: "26BK-PD001-ANM",
  type: "private-dining",
  sessionTitle: "Private Dining Experience",
  sessionDate: "Saturday, May 16",
  sessionTime: "19:00 - 21:00",
  seats: 2,
} as BookingCancellationEmailProps;
