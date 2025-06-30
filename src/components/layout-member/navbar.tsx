"use client";

import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSeason } from "@/contexts/season-context";

export default function Navbar() {
  const activeSeason = useSeason();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    window.location.href = "/";
  };

  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const token = Cookies.get("auth_token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch("/member/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileImage(data?.profile_picture_url || "/placeholder.svg");
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-16 py-2 bg-gradient-to-r from-[#00009C] to-[#000036] shadow-lg">
      <div className="w-full flex items-center justify-between">
        <div className="hidden md:flex items-center text-white h-12 w-32 relative">
          <Image
            src={activeSeason?.logo.url || "/images/PFL-Logo-Putih.png"}
            alt="PFL Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm text-white">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link
            href="/voting"
            className="hover:text-blue-400 transition-colors"
          >
            Voting
          </Link>
          <Link href="/tim" className="hover:text-blue-400 transition-colors">
            Tim
          </Link>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="bg-blue-pfl px-4 py-2 rounded-md hover:bg-blue-800 text-white transition-colors"
            >
              Masuk
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-white">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="bg-blue-pfl text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuItem
                  className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/member/profile")}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800">Profile Setting</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/member/tickets")}
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800">Riwayat Pembelian Tiket</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {isMenuOpen && (
          <div className="md:hidden mt-2 flex flex-col bg-white rounded shadow text-black space-y-2 p-4">
            <Link href="/" className="hover:text-blue-400">
              Home
            </Link>
            <Link href="/voting" className="hover:text-blue-400">
              Voting
            </Link>
            <Link href="/tim" className="hover:text-blue-400">
              Tim
            </Link>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="bg-blue-pfl px-4 py-2 rounded-md text-white bg-blue-600"
              >
                Masuk
              </Link>
            ) : (
              <>
                <button
                  onClick={() => (window.location.href = "/member/profile")}
                  className="flex items-center gap-2"
                >
                  <User className="h-5 w-5" /> Profile Setting
                </button>
                <button
                  onClick={() => (window.location.href = "/member/tickets")}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" /> Riwayat Tiket
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" /> Log out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
