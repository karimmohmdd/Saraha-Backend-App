import * as z from "zod";
import { LogoutActionEnum } from "../../common/enum/system.enum.js";

export const logoutSchema = z.object({
  body: z.object({
    action: z.nativeEnum(LogoutActionEnum),
  }),
});
