import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/session";

/**
 * The authoritative session check. proxy.ts only gates navigation, so every
 * admin page and server action must call this too.
 */
export const isAdminSession = cache(async () => {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
});

export async function requireAdmin() {
  if (!(await isAdminSession())) redirect("/admin/login");
}
