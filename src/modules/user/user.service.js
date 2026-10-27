import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../../config/config.js";
import { BadRequestException } from "../../common/exceptions/app.exceptions.js";
import {
  createLoginTokens,
  RevokeToken,
} from "../../common/security/token.security.js";
import { LogoutActionEnum } from "../../common/enum/system.enum.js";
import {
  delKey,
  getAllKeys,
  getBaseRevokeTokenKey,
  getRevokeTokenKey,
} from "../../common/cache.service.js";

export async function rotateToken(payload) {
  const tokenExpiryDate = payload.iat + JWT_ACCESS_EXPIRES_IN;
  const currentDate = Date.now() / 1000;

  if (tokenExpiryDate > currentDate) {
    throw BadRequestException({ errMsg: "Old Token Still Valid" });
  }

  const newTokens = createLoginTokens({
    payload: { sub: payload.sub },
    refreshExpiresIn:
      JWT_REFRESH_EXPIRES_IN - (Math.ceil(Date.now() / 1000) - payload.iat),
  });

  await RevokeToken(payload);

  return newTokens;
}

export async function logout(payload, user, action) {
  switch (action) {
    case LogoutActionEnum.ONE:
      await RevokeToken(payload);
      break;

    case LogoutActionEnum.ALL:
      user.changeCredencialesTime = new Date();
      await user.save();
      const userTokenKeys = await getAllKeys(
        getBaseRevokeTokenKey({ userId: payload.sub }),
      );
      await delKey(userTokenKeys);
      break;

    default:
      break;
  }
}
