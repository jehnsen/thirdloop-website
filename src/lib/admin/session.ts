import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/*
 * Stateless admin session: the cookie holds an expiry timestamp signed with
 * ADMIN_SESSION_SECRET. This module is imported by proxy.ts, so keep it free
 * of next/headers and other request-scoped APIs.
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_COOKIE_PATH = "/admin";
/** seconds */
export const SESSION_MAX_AGE = 60 * 60 * 8;

const MIN_SECRET_LENGTH = 32;

/**
 * The password is folded into the key, so changing ADMIN_PASSWORD signs out
 * every existing session.
 */
function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !secret || secret.length < MIN_SECRET_LENGTH) return null;
  return `${secret}:${password}`;
}

function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Hashing first gives equal-length buffers, so any two strings compare in constant time. */
function safeEqual(a: string, b: string) {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );
}

export function isAdminConfigured() {
  return signingKey() !== null;
}

export function checkAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return expected ? safeEqual(password, expected) : false;
}

export function createSessionToken() {
  const key = signingKey();
  if (!key) return null;

  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, key)}`;
}

export function isValidSessionToken(token: string | undefined) {
  const key = signingKey();
  if (!key || !token) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires, key))) return false;

  return Number(expires) > Date.now();
}
