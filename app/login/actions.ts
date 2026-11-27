"use server";

import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { saveToken } from "@/lib/session";

export type LoginState = { error?: string; email?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: new URLSearchParams({ username: email, password }),
    cache: "no-store",
  });

  if (!res.ok) return { error: "Invalid e-mail or password", email };

  const { access_token } = await res.json();
  await saveToken(access_token, 15 * 60);
  redirect("/account");
}
