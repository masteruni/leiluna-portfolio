import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names and lets a later Tailwind class override an earlier one (used by the components in
// src/components/ui that come from the shadcn / Aceternity registries).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
