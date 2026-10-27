import * as z from "zod";
import { validationFields } from "../../common/validation.js";

const loginSchemaBody = (lang) =>
  z.object({
    email: validationFields.email(lang),
    password: validationFields.password,
  });

export const loginSchema = (lang) =>
  z.object({
    body: loginSchemaBody(lang),
  });

export const signupSchema = (lang) =>
  z.object({
    body: loginSchemaBody(lang)
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
        { error: "Miss Match Password" },
      ),
  });

export const confirmEmailSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields.email(lang),
      otp: validationFields.otp,
    }),
  });
};

export const resendConfirmEmailSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields.email(lang),
    }),
  });
};

export const forgetPasswordSchema = resendConfirmEmailSchema;

export const verifyForgotPasswordSchema = confirmEmailSchema;

export const resetPasswordSchema = (lang) => {
  return z.object({
    body: z
      .object({
        email: validationFields(lang).email,
        otp: validationFields(lang).otp,
        password: validationFields(lang).password,
        confirmPassword: validationFields(lang).password,
      })
      .refine((value) => value.confirmPassword === value.password, {
        error: "Confirm Password Miss Match Password",
      }),
  });
};
