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

interface VendorConfirmationEmailProps {
  businessName: string;
  applicationId: string;
  submissionDate: string;
}

export default function VendorConfirmationEmail({
  businessName,
  applicationId,
  submissionDate,
}: VendorConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                Application Received!
              </Heading>
              <Text className="mb-3.75 text-base">Dear {businessName},</Text>
              <Text className="mb-3.75 text-base">
                Thank you for your interest in participating in the Chef&apos;s
                Kiss Festival! We have successfully received your vendor
                application.
              </Text>

              <Section className="my-5 rounded-md bg-white p-5">
                <Heading as="h2" className="mt-0 text-lg text-[#2c3e50]">
                  Application Details
                </Heading>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Application ID:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {applicationId}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Business Name:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {businessName}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Submission Date:
                      </td>
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
                  Our team will review your application within 5-7 business days
                </li>
                <li>
                  We&apos;ll contact you via email with updates on your
                  application status
                </li>
                <li>
                  If approved, you&apos;ll receive detailed information about
                  the festival logistics, setup times, and vendor guidelines
                </li>
                <li>Please keep your application ID for reference</li>
              </ul>

              <Text className="mb-3.75 text-base">
                If you have any questions in the meantime, please don&apos;t
                hesitate to reach out to us.
              </Text>

              <Text className="mb-3.75 text-base">
                We&apos;re excited about the possibility of having you at the
                festival!
              </Text>

              <Signature />
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

VendorConfirmationEmail.PreviewProps = {
  businessName: "[Vendor Business Name]",
  applicationId: "VEN-2025-001234",
  submissionDate: "[Actual Submission Date]",
} as VendorConfirmationEmailProps;
