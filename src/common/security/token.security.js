import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_USER_ACCESS_SIGNATURE,
  JWT_REFRESH_EXPIRES_IN,
  JWT_USER_REFRESH_SIGNATURE,
  JWT_ADMIN_ACCESS_SIGNATURE,
  JWT_ADMIN_REFRESH_SIGNATURE,
} from "../../config/config.js";
import { UnAuthorizeException } from "../exceptions/app.exceptions.js";
import { findByIdDoc } from "../../DB/db.repo.js";
import userModel from "../../DB/models/user.model.js";
import { TokenTypeEnum } from "../enum/token.enum.js";
import { RoleEnum } from "../enum/user.enum.js";
import { randomUUID } from "node:crypto";

export function signToken({ payload = {}, signature, options } = {}) {
  return jwt.sign(payload, signature, options);
}

export function verifyToken({ token, signature } = {}) {
  return jwt.verify(token, signature);
}

export function decodeToken(token) {
  return jwt.decode(token);
}

export function getSignature(userRole = RoleEnum.User) {
  const role =
    typeof userRole === "object" && userRole !== null
      ? userRole.userRole
      : userRole;
  let signatures = {};

  switch (role) {
    case RoleEnum.Admin:
      signatures.access_signature = JWT_ADMIN_ACCESS_SIGNATURE;
      signatures.refresh_signature = JWT_ADMIN_REFRESH_SIGNATURE;
      break;

    case RoleEnum.User:
    default:
      signatures.access_signature = JWT_USER_ACCESS_SIGNATURE;
      signatures.refresh_signature = JWT_USER_REFRESH_SIGNATURE;
      break;
  }
  return signatures;
}

export function createLoginTokens({
  user,
  payload = {},
  options,
  refreshExpiresIn = JWT_REFRESH_EXPIRES_IN,
} = {}) {
  const subject = user?.id || user?._id || payload?.sub;
  const role = user?.role ?? payload?.role ?? RoleEnum.User;
  const { access_signature, refresh_signature } = getSignature(role);

  const jwtId = randomUUID();

  const access_token = signToken({
    signature: access_signature,
    options: {
      ...options,
      expiresIn: JWT_ACCESS_EXPIRES_IN,
      subject,
      audience: [role],
      jwtid: jwtId,
    },
  });

  const refresh_token = signToken({
    signature: refresh_signature,
    options: {
      ...options,
      expiresIn: refreshExpiresIn,
      subject,
      audience: [role],
      jwtid: jwtId,
    },
  });

  return { access_token, refresh_token };
}

export async function checkToken({ token, tokenType }) {
  let payload = decodeToken(token);

  if (!payload.aud.length) {
    throw BadRequestException("Old Token data, Login Again");
  }

  const { access_signature, refresh_signature } = getSignature(payload.aud[0]);

  payload = jwt.verify(
    token,
    tokenType === TokenTypeEnum.ACCESS ? access_signature : refresh_signature,
  );

  if (!payload.sub) {
    throw UnAuthorizeException("Id Not Found");
  }

  const user = await findByIdDoc({ model: userModel, id: payload.sub });

  if (!user) {
    throw UnAuthorizeException("User Not Found");
  }

  return { user, payload };
}

export async function RevokeToken(payload) {
  const tokenExpiryDate = payload.iat + JWT_REFRESH_EXPIRES_IN; // 10/2027

  const consumedTime = Date.now() / 1000 - payload.iat;

  await setValue({
    key: await getRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
    value: payload.jti,
    options: {
      expiration: { value: Math.ceil(tokenExpiryDate - consumedTime) },
    },
  });
}
