"use client"
import { Metadata } from "next"

// export const metadata : Metadata = {
//     title : `Login`
// }


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"
import Image from "next/image"

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Image src="/images/pfl-logo-biru-horizontal.png" alt="PFL" width={150} height={50} />
          <h1 className="text-xl font-bold mt-4">LOGIN</h1>
        </div>
        <div className="space-y-4">
          <div className="w-full text-black rounded-lg">
            <label className="block text-sm mb-1">Email</label>
            <Input  className="rounded-lg" placeholder="Masukkan email" type="email" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <Input placeholder="Masukkan password" type="password" />
          </div>
          <Button className="text-white rounded-md w-full bg-blue-800 hover:bg-blue-900">Masuk</Button>
        </div>
        <div className="mt-4 text-sm text-center">
          <Link href="#" className="text-blue-700 hover:underline">Lupa Password?</Link>
        </div>
        <div className="mt-2 text-sm text-center">
          Belum memiliki akun?{" "}
          <Link href="/register" className="text-blue-700 hover:underline">Registrasi disini</Link>
        </div>
      </div>
    </AuthLayout>
  )
}
