"use client";

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
import { SignInResponse } from "./_models/response/sign-in";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function SignInPage() {
  const schema = z.object({
    email: z.string().nonempty("Email wajib diisi"),
    password: z.string().nonempty("Password wajib diisi"),
  });

  const signInMutation = useHttpMutation<z.infer<typeof schema>, SignInResponse>(
    "/superadmin/auth/login",
    {
      method: "POST",
      queryOptions: {
        onError: (error) => {
          form.setError("email", {
            type: "server",
            message: error?.data?.message || "Terjadi kesalahan",
          });
        },
        onSuccess: (data) => {
          Cookies.set("auth_token", data.data.token);
          toast.success("Login berhasil");
          location.href = "/sa/dashboard";
          console.log(data);
        },
      },
    }
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    signInMutation.mutate({
      body: values,
    });
  }

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
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
              >
                Masuk
              </Button>
            </form>
          </Form>
          {/* <div className="space-y-4 w-full">
          </div> */}
        </div>
        <div className="w-full flex items-center justify-center mb-8">
          <p>© 2024 Pro Futsal League</p>
        </div>
      </div>
    </AuthLayout>
  );
}
