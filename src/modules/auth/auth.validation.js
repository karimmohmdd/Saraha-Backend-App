import * as z from "zod";
import { validationFields } from "../../common/validation.js";

const loginSchemaBody = z.object({
  email: validationFields.email,
  password: validationFields.password,
});

export const loginSchema = z.object({
  body: loginSchemaBody,
});

export const signupSchema = z.object({
  body: loginSchemaBody
    .extend({
      username: validationFields.username,
      phone: validationFields.phone,
      gender: validationFields.gender.optional(),
      DOB: validationFields.DOB.optional(),
      confirmPassword: validationFields.password,
    })
    .refine(
      (value) => {
        return value.confirmPassword === value.password;
      },
      { error: "Confirm Password Miss Match Password" },
    ),
});
