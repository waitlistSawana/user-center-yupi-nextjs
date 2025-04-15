import SidebarLayout from "@/components/sidebar-layout";
import { type ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
