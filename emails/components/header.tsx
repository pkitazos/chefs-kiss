import { Img, Section } from "@react-email/components";

interface HeaderProps {
  baseUrl: string;
}

export function Header({ baseUrl }: HeaderProps) {
  return (
    <Section className="mb-6 text-center">
      <Img
        src={`${baseUrl}/assets/logo.png`}
        width="28"
        height="48"
        alt="Chef's Kiss"
        className="mx-auto"
      />
    </Section>
  );
}
