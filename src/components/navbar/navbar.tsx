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

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get("auth_token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        Cookies.remove("auth_token");
        window.location.href = "/";
    };

    return (
        <header className="relative top-0 left-0 right-0 z-50 px-16 py-4 bg-gradient-to-r from-[#00009C] to-[#000036] shadow-lg">
            <div className="w-full flex items-center justify-between">
                <div className="hidden md:flex items-center text-white h-12 w-32 relative">
                    <Image
                        src="/images/PFL-Logo-Putih.png"
                        alt="PFL Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <nav className="hidden md:flex items-center space-x-8 text-white">
                    <Link href="/" className="hover:text-blue-400 transition-colors">
                        Home
                    </Link>
                    <Link href="/voting" className="hover:text-blue-400 transition-colors">
                        Voting
                    </Link>
                    <Link href="/tim" className="hover:text-blue-400 transition-colors">
                        Tim
                    </Link>

                    {!isLoggedIn ? (
                        <Link
                            href="/login"
                            className="bg-blue-800 px-4 py-2 rounded-md hover:bg-blue-900 text-white transition-colors"
                        >
                            Masuk
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border-2 border-white">
                                        <AvatarImage src="/placeholder.svg" alt="Profile" />
                                        <AvatarFallback className="bg-blue-500 text-white">
                                            U
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                                <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100">
                                    <User className="h-5 w-5 text-gray-600" />
                                    <span className="text-gray-800">Profile Setting</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100">
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
            </div>
        </header>
    );
}