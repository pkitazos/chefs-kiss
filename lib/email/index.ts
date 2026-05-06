import { Resend } from "resend";
import { env } from "@/lib/env/server";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
  from = env.RESEND_FROM_EMAIL,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      attachments: [
        {
          path: `${env.NEXT_PUBLIC_APP_URL}/assets/logo.png`,
          filename: "logo.png",
          contentId: "logo",
        },
      ],
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};
