import { redirect } from "next/navigation";

// Force rebuild of this route to clear stale 'services' duplicate definition error
export default function PreviewPage() {
  redirect("/");
}
