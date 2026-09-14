import type { LucideProps } from "lucide-react";
import { createElement } from "react";
import { getProductIcon } from "@/lib/product-icons";

/**
 * Renders a product's icon from its stored name. The registry hands back
 * stable module-level components, so resolving one per render is safe —
 * doing it here keeps call sites from holding a component in a local.
 */
export function ProductIcon({
  icon,
  ...props
}: Omit<LucideProps, "ref"> & { icon: string }) {
  return createElement(getProductIcon(icon), props);
}
