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

interface WaitlistConfirmationEmailProps {
  fullName: string;
  waitlistId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  partySize: number;
  submissionDate: string;
}

export default function WaitlistConfirmationEmail({
  fullName,
  waitlistId,
  sessionTitle,
  sessionDate,
  sessionTime,
  partySize,
  submissionDate,
}: WaitlistConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Header />
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                You&apos;re on the waitlist
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                Thanks for your interest in the Chef&apos;s Kiss Festival. The
                session you selected is currently full, but we&apos;ve added you
                to the waitlist and will be in touch if a spot opens up.
              </Text>

              <Section className="my-5 rounded-md bg-white p-5">
                <Heading as="h2" className="mt-0 text-lg text-[#2c3e50]">
                  Waitlist Details
                </Heading>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Waitlist ID:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {waitlistId}
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
                      <td className="py-2 text-sm text-gray-500">
                        Party size:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {partySize}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Submitted:</td>
                      <td className="py-2 text-sm font-semibold">
                        {submissionDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Heading as="h3" className="mb-2.5 mt-6 text-base text-[#2c3e50]">
                What Happens Next?
              </Heading>
              <ul className="pl-5 text-[15px] leading-loose">
                <li>
                  If someone cancels their booking, we may reach out by email to
                  offer you the spot
                </li>
                <li>
                  Being on the waitlist does not guarantee a seat - spots are
                  offered in order as they become available
                </li>
                <li>Please keep your waitlist ID for reference</li>
              </ul>

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

WaitlistConfirmationEmail.PreviewProps = {
  baseUrl: "http://localhost:3000",
  fullName: "Jane Doe",
  waitlistId: "26WL01AYN",
  sessionTitle: "Private Dining Experience",
  sessionDate: "Saturday, May 16",
  sessionTime: "19:00 - 21:00",
  partySize: 2,
  submissionDate: "April 24, 2026",
} as WaitlistConfirmationEmailProps;
