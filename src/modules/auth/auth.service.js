import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/app.exceptions.js";
import { findOneDoc, createOneDoc } from "../../DB/db.repo.js";
import userModel from "../../DB/models/user.model.js";
import { compareHash, hashValue } from "../../common/security/hash.js";
import { HashToolEnum } from "../../common/enum/hashTool.enum.js";
import { decryptData, encryptData } from "../../common/security/encryption.js";
import { createLoginTokens } from "../../common/security/token.security.js";
import {
  delKey,
  getEmailKey,
  getBannedKey,
  getTrialsKey,
  getValue,
  isExists,
  setValue,
  ttlKey,
  getAllKeys,
  getBaseRevokeTokenKey,
} from "../../common/cache.service.js";
import { checkOTP, sendOTP } from "../../common/utils/email/email.service.js";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import emailEvent from "../../common/utils/email/email.event.js";

export async function signup(userData) {
  const { email } = userData;
  const user = await findOneDoc({
    model: userModel,
    filter: { email },
  });
  if (user) {
    ConflictException({ errMsg: "user already exists" });
  }

  // hashing password
  userData.password = await hashValue({
    value: userData.password,
    tool: HashToolEnum.BCRYPT,
  });

  // Phone Encryption
  userData.phone = encryptData({ value: userData.phone });

  const newUser = await createOneDoc({
    model: userModel,
    insertedData: userData,
  });

  emailEvent.emit("send-otp", {
    email,
    subject: EmailSubjectEnum.CONFIRM_EMAIL,
  });
  return newUser;
}

export async function login(userData) {
  const { email, password } = userData;
  const user = await findOneDoc({
    model: userModel,
    filter: { email: userData.email },
  });

  if (!user) {
    return NotFoundException({ errMsg: "Invalid password or email" });
  }

  if (!user.confirmEmail) {
    return BadRequestException({ errMsg: "user is not verified" });
  }

  const isMatch = await compareHash({
    value: password,
    hashValue: user.password,
    tool: HashToolEnum.BCRYPT,
  });

  // Phone Decryption

  user.phone = decryptData({ cipherText: user.phone });

  if (!isMatch) {
    return NotFoundException({ errMsg: "Invalid password or email" });
  }

  return createLoginTokens({ user });
}

export async function confirmEmail(bodyData) {
  const { email, otp } = bodyData;

  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: false },
  });

  if (!user) {
    throw NotFoundException({ errMsg: "Invalid Account" });
  }

  const hashedOTP = await getValue(
    getEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
  );

  if (!hashedOTP) {
    throw BadRequestException({ errMsg: "OTP Expired" });
  }

  const isOTPValid = await compareHash({ value: otp, hashValue: hashedOTP });

  if (!isOTPValid) {
    throw BadRequestException({ errMsg: "Invalid OTP" });
  }

  user.confirmEmail = true;
  await user.save();
  await delKey(getEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }));
}

export async function sendOtpForgetPassword(bodyData) {
  const { email } = bodyData;

  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: true },
  });

  if (!user) {
    return;
  }

  await checkOTP({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD });

  emailEvent.emit("send-otp", {
    email,
    subject: EmailSubjectEnum.FORGOT_PASSWORD,
  });
}

export async function verifyForgotPassword(bodyData) {
  const { email, otp } = bodyData;

  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: true },
  });

  if (!user) {
    throw NotFoundException({ errMsg: "Invalid Account" });
  }

  const hashedOTP = await getValue(
    getEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }),
  );

  if (!hashedOTP) {
    throw BadRequestException({ errMsg: "OTP Expired" });
  }

  const isOTPValid = await compareHash({ value: otp, hashValue: hashedOTP });

  if (!isOTPValid) {
    throw BadRequestException({ errMsg: "Invalid OTP" });
  }
}

export async function resendConfirmEmail(email) {
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: false },
  });

  if (!user) {
    throw NotFoundException({
      errMsg: "Invalid",
    });
  }

  await checkOTP({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });

  emailEvent.emit("send-otp", {
    email,
    subject: EmailSubjectEnum.CONFIRM_EMAIL,
  });
}

export async function resetPassword(bodyData) {
  const { email, otp, password } = bodyData;

  const user = await verifyForgotPassword({ email, otp });

  user.password = await hashValue({ value: password });
  user.changeCredencialesTime = new Date();
  await user.save();

  const result = await Promise.all([
    getAllKeys(getBaseRevokeTokenKey({ userId: user.id })),
    getAllKeys(
      getEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }),
    ),
  ]);

  await delKey([...result[0], ...result[1]]);
}
