
import Image from "next/image"
import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/login-background.png" 
          alt="Login Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70">
          <Image src="/images/pfl-logo-putih-vertical.png" alt="PFL Logo" width={120} height={120} />
        </div>
      </div>
    </div>
  )
}
