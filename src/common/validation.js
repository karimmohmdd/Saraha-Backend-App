import { GenderEnum } from "./enum/user.enum.js";
import { z } from "zod";
import { SystemLanguageEnum } from "./enum/system.enum.js";

export const validationFields = {
  username: z.string().min(2).max(20),
  email: (lang) =>
    z.email({
      error:
        lang == SystemLanguageEnum.EN
          ? "email is required must follow this pattern email@email.com"
          : "البريد الالكتروني مطلوب يجب ان يتبع هذا النمط email@email.com",
    }),
  password: z
    .string()
    .regex(/((?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&* ]).{8,16})$/g),
  phone: z.e164(),
  gender: z.literal(Object.values(GenderEnum)),
  DOB: z.date(),
  otp: z.string().regex(/^\d{6}$/),
};
