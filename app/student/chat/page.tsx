import { Suspense } from "react";
import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import PageClient from "./page.client";

export const metadata: Metadata = getPageMetadata("studentChat");

export default function Page(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PageClient {...props} />
    </Suspense>
  );
}
