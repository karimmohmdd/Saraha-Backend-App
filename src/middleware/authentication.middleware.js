import { UnAuthorizeException } from "../common/exceptions/app.exceptions.js";
import { TokenTypeEnum } from "../common/enum/token.enum.js";
import { checkToken } from "../common/security/token.security.js";
import { getRevokeTokenKey, isExists } from "../common/cache.service.js";

function auth(tokenType = TokenTypeEnum.ACCESS) {
  return async function auth(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw UnAuthorizeException("You need to login");
    }

    const [type, token] = authorization.split(" ");

    switch (type) {
      case "Basic":
        console.log(Buffer.from(token, "base64").toString().split(":"));
        break;
      case "Bearer":
        const { user, payload } = await checkToken({ token, tokenType });

        if (
          await isExists(
            await getRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
          )
        ) {
          throw UnAuthorizeException({
            errMsg: "Logged Out, Login and try again",
          });
        }

        if (payload.iat < user.changeCredencialesTime / 1000) {
          throw UnAuthorizeException({
            errMsg: "Logged Out, Login and try again",
          });
        }

        req.user = user;
        req.payload = payload;

        next();
    }
  };
}
export default auth;
