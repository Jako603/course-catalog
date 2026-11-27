import "server-only";
import { cookies } from "next/headers";

const COOKIE = "session";

export async function saveToken(token: string, maxAgeSeconds: number) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function readToken() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
