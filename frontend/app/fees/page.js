import { redirect } from "next/navigation";

export default function FeesRedirect() {
  redirect("/dashboard/admin/fees");
}