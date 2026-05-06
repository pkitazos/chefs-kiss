import { Img, Section } from "@react-email/components";

export function Header() {
  return (
    <Section className="mb-6 text-center">
      <Img
        src={"cid:logo"}
        width="28"
        height="48"
        alt="Chef's Kiss"
        className="mx-auto"
      />
    </Section>
  );
}
