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

interface PrivateDiningReceiptEmailProps {
  fullName: string;
}

export default function PrivateDiningReceiptEmail({
  fullName,
}: PrivateDiningReceiptEmailProps) {
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
                <Heading as="h2" className="mt-0 text-lg text-[#2c3e50]">
                  Receipt
                </Heading>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Paid by:</td>
                      <td className="py-2 text-sm font-semibold">{fullName}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Item:</td>
                      <td className="py-2 text-sm font-semibold">
                        Private Dining Experience
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Price per seat:
                      </td>
                      <td className="py-2 text-sm font-semibold">€140.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">Seats:</td>
                      <td className="py-2 text-sm font-semibold">2</td>
                    </tr>
                  </tbody>
                </table>
                <Hr className="my-3 border-gray-200" />
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm font-semibold text-[#2c3e50]">
                        Total:
                      </td>
                      <td className="py-2 text-sm font-bold text-[#2c3e50]">
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

PrivateDiningReceiptEmail.PreviewProps = {
  fullName: "Lea Majounie",
} as PrivateDiningReceiptEmailProps;
