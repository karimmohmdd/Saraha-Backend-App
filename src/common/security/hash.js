import bcrypt from "bcrypt";
import argon2 from "argon2";
import { SALT_ROUND } from "../../config/config.js";
import { HashToolEnum } from "../enum/hashTool.enum.js";

export async function hashValue({
  value,
  saltRound = SALT_ROUND,
  tool = HashToolEnum.BCRYPT,
}) {
  let hashedValue;

  switch (tool) {
    case HashToolEnum.BCRYPT:
      hashedValue = await bcrypt.hash(value, saltRound);
      break;

    case HashToolEnum.ARGON:
      hashedValue = await argon2.hash(value);
      break;

    default:
      break;
  }

  return hashedValue;
}

export async function compareHash({
  value,
  hashValue,
  tool = HashToolEnum.BCRYPT,
}) {
  let isMatch;

  switch (tool) {
    case HashToolEnum.BCRYPT:
      isMatch = await bcrypt.compare(value, hashValue);
      break;

    case HashToolEnum.ARGON:
      isMatch = await argon2.verify(hashValue, value);
      break;

    default:
      break;
  }

  return isMatch;
}
