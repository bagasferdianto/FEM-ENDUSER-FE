import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="w-full h-full flex flex-col justify-between items-center max-w-sm">
        <div className="self-start">
          <Image
            src="/images/pfl-logo-biru-horizontal.png"
            alt="PFL"
            width={150}
            height={50}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-center mb-4 w-full">
            <h1 className="text-lg font-bold">Masuk Sebagai Superadmin</h1>
          </div>
          <div className="space-y-4 w-full">
            <div className="w-full text-black">
              <Label htmlFor="email">Email</Label>
              <Input placeholder="Masukkan email" type="email" id="email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input placeholder="Masukkan password" type="password" id="password" />
            </div>
            <Button className="text-white w-full bg-blue-800 hover:bg-blue-900" size={"lg"}>
              Masuk
            </Button>
          </div>
        </div>
        <div className="w-full flex items-center justify-center mb-8">
          <p>© 2024 Pro Futsal League</p>
        </div>
      </div>
    </AuthLayout>
  );
}
