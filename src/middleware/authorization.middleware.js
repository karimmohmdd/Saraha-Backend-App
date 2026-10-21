import { ForbiddenException } from "../common/exceptions/app.exceptions.js";

export function authorization(roles) {
  return async function authorization(req, res, next) {
    if (!roles.includes(req.user.role)) {
      throw ForbiddenException({ errMsg: "You dont have access" });
    }
    return next();
  };
}
