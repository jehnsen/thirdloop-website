"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  parseProductForm,
  type ProductFormState,
} from "@/lib/admin/product-form";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_PATH,
  SESSION_MAX_AGE,
  checkAdminPassword,
  createSessionToken,
  isAdminConfigured,
} from "@/lib/admin/session";
import {
  insertProduct,
  removeProduct,
  replaceProduct,
  setProductEnabled,
} from "@/lib/product-store";

/*
 * Server actions are reachable by direct POST, not just through the admin UI,
 * so every mutation re-checks the session and validates its own arguments.
 */

export type LoginState = { error?: string };

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Admin access isn't configured on this server. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.",
    };
  }

  const password = formData.get("password");
  const token = createSessionToken();
  if (typeof password !== "string" || !checkAdminPassword(password) || !token) {
    // A fixed delay slows down online password guessing.
    await new Promise((resolve) => setTimeout(resolve, 750));
    return { error: "That password isn't right." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: SESSION_COOKIE_PATH,
    maxAge: SESSION_MAX_AGE,
  });

  // Only follow `next` within the admin area, never to another origin.
  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/admin/") ? next : "/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { path: SESSION_COOKIE_PATH, maxAge: 0 });
  redirect("/admin/login");
}

/** Public product pages are prerendered, so every change must invalidate them. */
function revalidateCatalogue() {
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin", "layout");
}

export async function saveProduct(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.ok) {
    return { errors: parsed.errors, message: "Some fields need attention." };
  }

  const originalSlug = formData.get("originalSlug");
  const isEdit = typeof originalSlug === "string" && originalSlug !== "";
  const result = isEdit
    ? await replaceProduct(originalSlug, parsed.product)
    : await insertProduct(parsed.product);

  if (!result.ok) {
    return result.error === "slug-taken"
      ? {
          errors: { slug: "Another product already uses this slug." },
          message: "Some fields need attention.",
        }
      : {
          message:
            "This product no longer exists — it may have been deleted in another tab.",
        };
  }

  revalidateCatalogue();
  redirect(`/admin/products?notice=${isEdit ? "updated" : "created"}`);
}

export async function deleteProduct(slug: string) {
  await requireAdmin();
  if (typeof slug !== "string") return;

  await removeProduct(slug);
  revalidateCatalogue();
  redirect("/admin/products?notice=deleted");
}

export async function setProductVisibility(slug: string, enabled: boolean) {
  await requireAdmin();
  if (typeof slug !== "string" || typeof enabled !== "boolean") return;

  await setProductEnabled(slug, enabled);
  revalidateCatalogue();
}
