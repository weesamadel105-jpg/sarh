import { Suspense } from "react";
import AdminChatClient from "./page.client";

export default function AdminChatPage(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AdminChatClient {...props} />
    </Suspense>
  );
}
