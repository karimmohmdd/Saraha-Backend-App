import { Router } from "express";
import {
  signup,
  login,
  resendConfirmEmail,
  confirmEmail,
  sendOtpForgetPassword,
  verifyForgotPassword,
  resetPassword,
} from "./auth.service.js";
import { successResponse } from "../../common/response/success.response.js";
import validation from "../../middleware/validation.middleware.js";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  resendConfirmEmailSchema,
  resetPasswordSchema,
  signupSchema,
  verifyForgotPasswordSchema,
} from "./auth.validation.js";
const authController = Router();

authController.post("/signup", validation(signupSchema), async (req, res) => {
  const result = await signup(req.validateData.body);

  successResponse({ res, data: result, msg: "created", statusCode: 201 });
});

authController.post("/login", validation(loginSchema), async (req, res) => {
  const result = await login(req.validateData.body);
  successResponse({ res, data: result, msg: "done", statusCode: 200 });
});

authController.patch(
  "/confirm-email",
  validation(confirmEmailSchema),
  async (req, res) => {
    const result = await confirmEmail(req.validateData.body);
    successResponse({ res, data: result, msg: "done", statusCode: 200 });
  },
);

authController.post(
  "/resend-otp",
  validation(resendConfirmEmailSchema),
  async (req, res) => {
    const result = await resendConfirmEmail(req.validateData.body.email);
    successResponse({ res, data: result, msg: "done", statusCode: 200 });
  },
);

authController.post(
  "/send-otp-forget-password",
  validation(forgetPasswordSchema),
  async (req, res) => {
    const result = await sendOtpForgetPassword(req.validateData.body.email);
    successResponse({ res, data: result, msg: "done", statusCode: 200 });
  },
);

authController.patch(
  "/verify-forget-password",
  validation(verifyForgotPasswordSchema),
  async (req, res) => {
    const result = await verifyForgotPassword(req.validateData.body);
    successResponse({ res, data: result, msg: "done", statusCode: 200 });
  },
);

authController.patch(
  "/reset-password",
  validation(resetPasswordSchema),
  async (req, res) => {
    const result = await resetPassword(req.validateData.body);
    successResponse({ res, data: result, msg: "done", statusCode: 200 });
  },
);

export default authController;
