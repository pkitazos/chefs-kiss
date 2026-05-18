import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Header } from "./components/header";
import { Signature } from "./components/signature";

interface PrivateDiningReceiptV3EmailProps {
  fullName: string;
}

export default function PrivateDiningReceiptV3Email({
  fullName,
}: PrivateDiningReceiptV3EmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Header />
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                Payment Receipt
              </Heading>
              <Text className="mb-3.75 text-base">Dear {fullName},</Text>
              <Text className="mb-3.75 text-base">
                Thank you for your payment. Below is your receipt for the
                Chef&apos;s Kiss Private Dining Experience.
              </Text>

              <Section className="my-5 rounded-md bg-white p-5">
                <Text className="mt-0 mb-1 text-xs text-gray-400">
                  Paid by
                </Text>
                <Text className="mt-0 mb-5 text-base font-semibold text-[#2c3e50]">
                  {fullName}
                </Text>

                <Text className="mt-0 mb-1 text-sm font-semibold text-[#2c3e50]">
                  Private Dining Experience
                </Text>
                <Text className="mt-0 mb-0 text-sm text-gray-500">
                  2 seats × €140.00
                </Text>

                <Hr className="my-4 border-gray-200" />

                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="text-base font-semibold text-[#2c3e50]">
                        Total
                      </td>
                      <td className="text-right text-base font-bold text-[#2c3e50]">
                        €280.00
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

PrivateDiningReceiptV3Email.PreviewProps = {
  fullName: "Lea Majounie",
} as PrivateDiningReceiptV3EmailProps;
