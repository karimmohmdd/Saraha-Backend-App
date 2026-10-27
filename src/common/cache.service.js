import { client } from "../DB/redis.connection.js";

// =============================== KEYS SERVICES ==================================

export function getAllKeys(prefix) {
  return `${prefix}*`;
}

// ========= Email Keys Services =========

export function getEmailBaseKey({ email }) {
  return `User::${email}`;
}

export function getEmailKey({ email, subject }) {
  return `${getEmailBaseKey({ email })}::${subject}`;
}
export function getTrialsKey({ email, subject }) {
  return `${getEmailKey({ email, subject })}::Trials`;
}
export function getBannedKey({ email, subject }) {
  return `${getEmailKey({ email, subject })}::Banned`;
}

// ========= Token Revoke Keys Services =========

export function getBaseRevokeTokenKey({ userId }) {
  return `User::${userId}::RevokeToken`;
}

export function getRevokeTokenKey({ userId, jti }) {
  return `${getBaseRevokeTokenKey({ userId })}::${jti}`;
}

// ====================== Cache Services ======================

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
  if (typeof key === "object" && key?.key) {
    key = key.key;
  }
  let result;
  try {
    result = await client.get(key);
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
}

export async function delKey(key) {
  if (typeof key === "object" && key?.key) {
    key = key.key;
  }
  return await client.del(key);
}

export async function ttlKey(key) {
  if (typeof key === "object" && key?.key) {
    key = key.key;
  }
  return await client.ttl(key);
}

export async function isExists(key) {
  if (typeof key === "object" && key?.key) {
    key = key.key;
  }
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

export async function incrKey({ key, value = 1 }) {
  return await client.incrBy(key, value);
}
