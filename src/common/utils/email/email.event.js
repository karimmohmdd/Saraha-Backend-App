import EventEmitter from "node:events";
import { sendOTP } from "./email.service.js";

export const emailEvent = new EventEmitter();

emailEvent.on("send-otp", async ({ email, subject }) => {
  try {
    await sendOTP({ email, subject });
  } catch (error) {
    console.log(`Error While sending Email to ${email}`);
  }
});

export default emailEvent;
