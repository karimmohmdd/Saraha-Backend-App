import { Router } from "express";
import { successResponse } from "../../common/response/success.response.js";
import auth from "../../middleware/authentication.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import { TokenTypeEnum } from "../../common/enum/token.enum.js";
import { logout, rotateToken, uploadProfilePic } from "./user.service.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { logoutSchema } from "./user.validation.js";
import localUpload from "../../common/utils/multer/multer.config.js";
import { FileTypesEnum } from "../../common/enum/multer.enum.js";
import {
  checkFileContent,
  handelFileMiddleware,
} from "../../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.get("/get-profile", auth(), async (req, res) => {
  successResponse({ res, data: req.user, payload: req.payload });
});

userRouter.post(
  "/rotate-token",
  auth(TokenTypeEnum.REFRESH),
  async (req, res) => {
    const result = await rotateToken(req.payload);
    successResponse({ res, data: result });
  },
);

userRouter.post(
  "/logout",
  auth(),
  validation(logoutSchema),
  async (req, res) => {
    const result = await logout(
      req.payload,
      req.user,
      req.validateData.body.action,
    );
    successResponse({ res, data: result });
  },
);

userRouter.post(
  "/upload-profile-pic",
  auth(),
  handelFileMiddleware({
    multerMiddleware: localUpload({
      acceptedFileTypes: FileTypesEnum.image,
      folderName: "User",
    }).single("profilePic"),
    folderName: "User",
    acceptedFileTypes: FileTypesEnum.image,
  }),
  async (req, res) => {
    uploadProfilePic(req.user, req.file);
    successResponse({ res });
  },
);
export default userRouter;
