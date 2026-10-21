import express from "express";
import authController from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import globalErrMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import dbConnection from "./DB/connection.js";
import { PORT } from "./config/config.js";

async function bootstrap() {
  const app = express();

  app.use(express.json());

  await dbConnection();

  app.use("/auth", authController);
  app.use("/user", userRouter);

  app.all("{/*dummy}", notFoundMiddleware);

  app.use(globalErrMiddleware);

  app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
}

bootstrap();
