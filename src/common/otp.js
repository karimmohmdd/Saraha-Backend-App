import { randomInt } from "crypto";

function generateOtp() {
  return randomInt(100000, 999999);
}

export default generateOtp;
