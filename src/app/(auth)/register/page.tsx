"use client";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useHttpMutation } from "react-ohttp";
import { toast } from "sonner";
import { RegisterResponse } from "./_models/response/register-member";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const schema = z.object({
    name: z.string().nonempty("Nama lengkap wajib diisi"),
    email: z.string().nonempty("Email wajib diisi").email("Email tidak valid"),
    password: z.string().nonempty("Password wajib diisi"),
  });

  const registerMutation = useHttpMutation<
    z.infer<typeof schema>,
    RegisterResponse
  >("/member/auth/register", {
    method: "POST",
    queryOptions: {
      onError: (error) => {
        form.setError("email", {
          type: "server",
          message: error?.data?.message || "Terjadi kesalahan",
        });
      },
      onSuccess: () => {
        toast.success("Registrasi berhasil, silakan login");
        router.push("/login");
      },
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    registerMutation.mutate({ body: values });
  }

  return (
    <AuthLayout>
      <div className="w-full h-full flex flex-col justify-between items-center max-w-sm py-16">
        <div className="self-center">
          <Image
            src="/images/pfl-logo-biru-horizontal.png"
            alt="PFL"
            width={150}
            height={50}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-center mb-4 w-full">
            <h1 className="text-lg font-bold">REGISTRASI</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <div className="w-full text-black">
                <Label htmlFor="name">Nama Lengkap</Label>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama lengkap"
                          type="text"
                          id="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full text-black">
                <Label htmlFor="email">Email</Label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Masukkan email"
                          type="email"
                          id="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Masukkan password"
                          type="password"
                          id="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="text-white w-full bg-blue-800 hover:bg-blue-900"
                size={"lg"}
                type="submit"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftarkan...
                  </span>
                ) : (
                  "Daftar"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-sm text-center">
            Sudah memiliki akun?{" "}
            <a href="/login" className="text-blue-700 hover:underline">
              Login di sini
            </a>
          </div>
        </div>
        <div className="w-full flex items-center justify-center mb-8">
          <p>© 2024 Pro Futsal League</p>
        </div>
      </div>
    </AuthLayout>
  );
}
