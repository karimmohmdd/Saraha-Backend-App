import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY } from "../../config/config.js";

export function encryptData({ value, key = ENCRYPTION_KEY }) {
  return CryptoJS.AES.encrypt(value, key).toString();
}

export function decryptData({ cipherText, key = ENCRYPTION_KEY }) {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
