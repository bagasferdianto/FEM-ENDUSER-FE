"use client";

import {
  BarChart3,
  Calendar,
  Home,
  Trophy,
  Users,
  Vote,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";

const menuItems = [
  {
    title: "Dashboard",
    url: "/sa/dashboard",
    icon: Home,
  },
  {
    title: "Kelola Season",
    url: "/sa/manage-season",
    icon: Calendar,
  },
  {
    title: "Kelola Series",
    url: "/sa/manage-series",
    icon: Trophy,
  },
  {
    title: "Kelola Voting",
    url: "/sa/manage-voting",
    icon: Vote,
  },
  {
    title: "Data Tim",
    url: "/sa/team-data",
    icon: Users,
  },
  {
    title: "Data Player",
    url: "/sa/player-data",
    icon: User,
  },
  {
    title: "Data Tim Yang Bermain",
    url: "/sa/playing-team-data",
    icon: BarChart3,
  },
  {
    title: "Data Venue",
    url: "/sa/venue-data",
    icon: MapPin,
  },
  {
    title: "Transaksi",
    url: "/sa/transaction",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Image
            src="/images/pfl-logo-biru-horizontal.png"
            alt="PFL"
            width={150}
            height={50}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="data-[active=true]:bg-blue-pfl data-[active=true]:text-white hover:bg-slate-200 gap-3"
                    size={"custom"}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
