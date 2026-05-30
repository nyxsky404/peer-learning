import nodemailer from "nodemailer";
import { env } from "../config.js";

export const sendEmail = async (email, url) => {
  const emailUser = env.EMAIL_USER;
  const emailPass = env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASS environment variables must be set before sending email."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: emailUser,
    to: email,
    subject: "Password Reset",
    html: `<p>Click below to reset password:</p>
           <a href="${url}">${url}</a>`,
  });
};