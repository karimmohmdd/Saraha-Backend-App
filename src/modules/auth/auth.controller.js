import { Router } from "express";
import { signup, login } from "./auth.service.js";
import { successResponse } from "../../common/response/success.response.js";
import validation from "../../middleware/validation.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
const authController = Router();

authController.post("/signup", validation(signupSchema), async (req, res) => {
  const result = await signup(req.validateData.body);

  successResponse({ res, data: result, msg: "created", statusCode: 201 });
});

authController.post("/login", validation(loginSchema), async (req, res) => {
  const result = await login(req.validateData.body);
  successResponse({ res, data: result, msg: "done", statusCode: 200 });
});

export default authController;
