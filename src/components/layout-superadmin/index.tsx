import type React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout-superadmin/app-sidebar";
import { AppHeader } from "@/components/layout-superadmin/app-header";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
