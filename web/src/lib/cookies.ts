import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { ResponseCookies } from "next/dist/server/web/spec-extension/cookies";

export function setAuthToken(cookies: ResponseCookies, token: string) {
  cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthToken(cookies: ResponseCookies) {
  cookies.set("token", "", { maxAge: 0, path: "/" });
}
