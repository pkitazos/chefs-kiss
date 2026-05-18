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

interface PrivateDiningReceiptV2EmailProps {
  fullName: string;
}

export default function PrivateDiningReceiptV2Email({
  fullName,
}: PrivateDiningReceiptV2EmailProps) {
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
                <Heading as="h2" className="mt-0 mb-4 text-lg text-[#2c3e50]">
                  Receipt
                </Heading>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Description
                      </th>
                      <th className="border-b border-gray-200 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Qty
                      </th>
                      <th className="border-b border-gray-200 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Price
                      </th>
                      <th className="border-b border-gray-200 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 text-sm font-semibold">
                        Private Dining Experience
                      </td>
                      <td className="py-3 text-center text-sm">2</td>
                      <td className="py-3 text-right text-sm">€140.00</td>
                      <td className="py-3 text-right text-sm">€280.00</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        className="border-t border-gray-200 py-3 text-right text-sm font-semibold text-[#2c3e50]"
                      >
                        Total:
                      </td>
                      <td className="border-t border-gray-200 py-3 text-right text-sm font-bold text-[#2c3e50]">
                        €280.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <Text className="mt-4 mb-0 text-xs text-gray-400">
                  Paid by: {fullName}
                </Text>
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

PrivateDiningReceiptV2Email.PreviewProps = {
  fullName: "Lea Majounie",
} as PrivateDiningReceiptV2EmailProps;
