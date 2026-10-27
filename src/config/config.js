import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path:
    process.env.NODE_ENV == "PROD"
      ? path.resolve("./.env.prod")
      : path.resolve("./.env.dev"),
});

export const PORT = Number(process.env.PORT) || 3000;

export const USER_NAME = process.env.USER_NAME || "user";

export const USER_PASSWORD = process.env.USER_PASSWORD || "123";

export const DB_URI = process.env.DB_ATLAS || "";

export const SALT_ROUND = Number(process.env.SALT_ROUND) || 12;

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

export const JWT_ADMIN_REFRESH_SIGNATURE =
  process.env.JWT_ADMIN_REFRESH_SIGNATURE;
export const JWT_ADMIN_ACCESS_SIGNATURE =
  process.env.JWT_ADMIN_ACCESS_SIGNATURE;

export const JWT_ACCESS_EXPIRES_IN = Number(process.env.JWT_ACCESS_EXPIRES_IN);
export const JWT_REFRESH_EXPIRES_IN = Number(
  process.env.JWT_REFRESH_EXPIRES_IN,
);

export const JWT_USER_REFRESH_SIGNATURE =
  process.env.JWT_USER_REFRESH_SIGNATURE;
export const JWT_USER_ACCESS_SIGNATURE = process.env.JWT_USER_ACCESS_SIGNATURE;

export const REDIS_URI = process.env.REDIS_URI;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
