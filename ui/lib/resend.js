import { Resend } from "resend";
import { ResetPasswordTemplate } from "./mails/ResetPasswordTemplate";
const resend = new Resend("");

export async function resetPasswordEmail() {
  try {
    const key = "123";
    const data = await resend.emails.send({
      from: "SuperAgent <bot@superagent.com>",
      to: [],
      subject: "SuperAgent Password Reset",
      react: ResetPasswordTemplate({ emailAddress, key }),
    });
  } catch (error) {
    console.error(error);
  }
}
