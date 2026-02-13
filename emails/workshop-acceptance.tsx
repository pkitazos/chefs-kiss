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

interface WorkshopAcceptanceEmailProps {
  contactPerson: string;
  workshopName: string;
  applicationId: string;
  festivalDate: string;
}

export default function WorkshopAcceptanceEmail({
  contactPerson,
  workshopName,
  applicationId,
  festivalDate,
}: WorkshopAcceptanceEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans leading-relaxed text-[#333]">
          <Container className="mx-auto max-w-150 p-5">
            <div className="mb-5 rounded-lg bg-gray-50 p-7.5">
              <Heading className="mb-5 text-2xl text-[#2c3e50]">
                Congratulations! Your Application is Approved!
              </Heading>
              <Text className="mb-3.75 text-base">Dear {contactPerson},</Text>
              <Text className="mb-3.75 text-base">
                We&apos;re thrilled to inform you that your workshop application
                has been
                <strong> approved</strong>! We can&apos;t wait to have you at
                the Chef&apos;s Kiss Food Festival in {festivalDate}.
              </Text>

              <Section className="my-5 rounded-md border-2 border-green-500 bg-green-50 p-5">
                <Heading as="h2" className="mt-0 text-lg text-[#2c3e50]">
                  Festival Details
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
                        Workshop Name:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {workshopName}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-gray-500">
                        Festival Date:
                      </td>
                      <td className="py-2 text-sm font-semibold">
                        {festivalDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Text className="mb-3.75 text-base">Payment</Text>

              <Text className="mb-3.75 text-base">
                If you have any questions or need assistance, please don&apos;t
                hesitate to contact us at{" "}
                <span className="text-[#98244c]">info@chefskiss.com.cy</span>.
              </Text>

              <Text className="mb-3.75 text-base">
                We&apos;re looking forward to a fantastic festival with you!
              </Text>

              <Signature />
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WorkshopAcceptanceEmail.PreviewProps = {
  contactPerson: "[Contact Person]",
  workshopName: "[Workshop Name]",
  applicationId: "WS-2025-001234",
  festivalDate: "[Actual Festival Date]",
} as WorkshopAcceptanceEmailProps;
