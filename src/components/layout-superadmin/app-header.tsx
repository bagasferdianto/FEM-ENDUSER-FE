"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useGetProfile } from "@/app/(superadmin)/sa/(authenticated)/_services/profile";
import { signOut } from "@/app/(superadmin)/sa/(auth)/signout/_actions/signout";

export function AppHeader() {
  const pathname = usePathname();

  const { data } = useGetProfile();

  // Get page title based on current path
  const getPageTitle = (path: string) => {
    const pathMap: { [key: string]: string } = {
      "/sa/dashboard": "Dashboard",
      "/sa/manage-season": "Kelola Season",
      "/sa/manage-series": "Kelola Series",
      "/sa/manage-voting": "Kelola Voting",
      "/sa/team-data": "Data Tim",
      "/sa/player-data": "Data Player",
      "/sa/playing-team-data": "Data Tim Yang Bermain",
      "/sa/venue-data": "Data Venue",
      "/sa/transaction": "Transaksi",
    };
    return pathMap[path] || "";
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          {getPageTitle(pathname)}
        </h3>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 h-8 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {data?.data?.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{data?.data?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {data?.data?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
