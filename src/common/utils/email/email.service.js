import {
  getEmailKey,
  getBannedKey,
  getTrialsKey,
  getValue,
  incrKey,
  isExists,
  setValue,
  ttlKey,
} from "../../cache.service.js";
import { hashValue } from "../../security/hash.js";
import generateOtp from "../../otp.js";
import transporter from "./email.config.js";
import { EmailTemplate } from "./email.template.js";
import { BadRequestException } from "../../exceptions/app.exceptions.js";

export async function sendMail({ to, cc, bcc, subject, html, attachments }) {
  try {
    const info = await transporter.sendMail({
      from: '"Example Team" <karimmohmdd01@gmail.com>', // sender address
      to,
      cc,
      bcc,
      subject,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export async function sendOTP({ email, subject }) {
  const otp = generateOtp();
  await sendMail({
    to: email,
    subject,
    html: EmailTemplate[subject](otp),
  });

  await setValue({
    key: getEmailKey({ email, subject }),
    value: await hashValue({ value: otp }),
    options: { expiration: { type: "EX", value: 180 } },
  });

  const trialsKey = getTrialsKey({ email, subject });
  if (await getValue(trialsKey)) {
    await incrKey({ key: trialsKey });
  } else {
    await setValue({
      key: trialsKey,
      value: 1,
      options: { expiration: { type: "EX", value: 20 * 60 } },
    });
  }
}

export async function checkOTP({ email, subject }) {
  const oldOTP_TTL = await ttlKey(getEmailKey({ email, subject }));

  if (oldOTP_TTL > 0) {
    throw BadRequestException({
      errMsg: `OTP Code Already Sent, Please Check Your Inbox or Wait ${oldOTP_TTL} Seconds`,
    });
  }

  const isBanned = await isExists(getBannedKey({ email, subject }));

  if (isBanned) {
    throw BadRequestException({
      errMsg: "Too many attempts, please try again later",
    });
  }

  let userTrials = await getValue(getTrialsKey({ email, subject }));

  if (userTrials == 2) {
    await setValue({
      key: getBannedKey({ email, subject }),
      value: 0,
      options: { expiration: { value: 15 * 60 } },
    });
    throw BadRequestException({
      errMsg: "Too many attempts, please try again later",
    });
  }
}
