import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Locale-aware drop-in replacements for next/link and next/navigation. Using
// these in the landing keeps the active locale when navigating between pages.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
