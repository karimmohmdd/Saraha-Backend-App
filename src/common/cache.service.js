import { client } from "../DB/redis.connection.js";

export async function getBaseRevokeTokenKey({ userId }) {
  return `User::${userId}::RevokeToken`;
}

export async function getRevokeTokenKey({ userId, jti }) {
  return `${getBaseRevokeTokenKey(userId)}::${jti}`;
}

export async function getAllKeys(prefix) {
  return `${prefix}*`;
}

export async function setValue({
  key,
  value,
  options = { expiration: { type: "EX", value: 100 } },
}) {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  if (!options.expiration.type) {
    options.expiration.type = "EX";
  }

  return await client.set(key, value, {
    [options.expiration.type]: options.expiration.value,
  });
}

export async function getValue(key) {
  let result;
  try {
    result = await client.get(key);
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
}

export async function delKey(key) {
  return await client.del(key);
}

export async function ttlKey(key) {
  return await client.ttl(key);
}

export async function isExists(key) {
  return await client.exists(key);
}

export async function updateValue({
  key,
  value,
  options = { expiration: { type: "EX", value: 100 } },
}) {
  const isKeyExists = await isExists(key);

  if (!isKeyExists) {
    return 0;
  }

  return await setValue({ key, value, options });
}
