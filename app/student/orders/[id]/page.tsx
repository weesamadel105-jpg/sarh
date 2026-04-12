import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import PageClient from "./page.client";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseMetadata = getPageMetadata("studentOrders");
  return {
    ...baseMetadata,
    title: `طلب رقم ${params.id} | منصة صرح`
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  return <PageClient params={props.params} />;
}
