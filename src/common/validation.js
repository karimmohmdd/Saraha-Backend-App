import { GenderEnum } from "./enum/user.enum.js";
import { z } from "zod";

export const validationFields = {
  username: z.string().min(2).max(20),
  email: z.email(),
  password: z.string(),
  phone: z.e164(),
  gender: z.literal(Object.values(GenderEnum)),
  DOB: z.date(),
};
