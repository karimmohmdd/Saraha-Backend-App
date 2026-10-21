import bcrypt, { compare, hash } from "bcrypt";
import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/app.exceptions.js";
import { findOneDoc, createOneDoc } from "../../DB/db.repo.js";
import userModel from "../../DB/models/user.model.js";
import { compareHash, hashValue } from "../../common/security/hash.js";
import { HashToolEnum } from "../../common/enum/hashTool.enum.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { decryptData, encryptData } from "../../common/security/encryption.js";
import {
  JWT_USER_ACCESS_SIGNATURE,
  JWT_ACCESS_EXPIRES_IN,
  JWT_USER_REFRESH_SIGNATURE,
  JWT_REFRESH_EXPIRES_IN,
} from "../../config/config.js";
import { createLoginTokens } from "../../common/security/token.security.js";

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
