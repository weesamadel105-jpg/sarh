import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import PageClient from "./page.client";

export const metadata: Metadata = getPageMetadata("pricing");

export default function Page(props: any) {
  return <PageClient {...props} />;
}
