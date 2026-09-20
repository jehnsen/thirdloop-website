import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BrainCircuit,
  Boxes,
  Building2,
  CalendarCheck,
  Car,
  ChartColumn,
  Compass,
  Factory,
  Globe,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  MessageSquare,
  Newspaper,
  Package,
  Plane,
  Receipt,
  ScanBarcode,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  Users,
  Utensils,
  Wallet,
  Workflow,
  Wrench,
} from "lucide-react";

/**
 * Icons a product can use. Products store the key (a plain string) so they
 * can live in JSON and cross the server/client boundary; components resolve
 * it back to a Lucide component here. Add an entry to offer a new icon.
 */
export const productIcons = {
  Sparkles,
  Car,
  Bot,
  BrainCircuit,
  ScanBarcode,
  Newspaper,
  Leaf,
  GraduationCap,
  Truck,
  ShoppingCart,
  Store,
  Package,
  Boxes,
  Wallet,
  Receipt,
  ChartColumn,
  Compass,
  CalendarCheck,
  MessageSquare,
  Users,
  Stethoscope,
  HeartPulse,
  Building2,
  House,
  Landmark,
  Factory,
  Wrench,
  Utensils,
  Plane,
  Globe,
  Smartphone,
  Workflow,
  ShieldCheck,
} satisfies Record<string, LucideIcon>;

export type ProductIconName = keyof typeof productIcons;

export const productIconNames = Object.keys(productIcons) as ProductIconName[];

export function isProductIconName(value: string): value is ProductIconName {
  return Object.hasOwn(productIcons, value);
}

export function getProductIcon(name: string): LucideIcon {
  return isProductIconName(name) ? productIcons[name] : Sparkles;
}
