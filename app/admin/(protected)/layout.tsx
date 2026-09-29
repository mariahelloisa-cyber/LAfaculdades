import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/supabase/admin";
import AdminSidebar from "./AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-1 bg-surface">
      <AdminSidebar email={user.email ?? ""} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
