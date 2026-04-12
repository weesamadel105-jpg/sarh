import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import ContactPage from "./page.client";

export const metadata: Metadata = getPageMetadata("contact");

export default function Page() {
  return <ContactPage />;
}
