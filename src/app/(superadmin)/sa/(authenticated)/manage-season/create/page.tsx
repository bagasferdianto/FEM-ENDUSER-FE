"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FileUpload, Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  RequiredLabel,
} from "@/components/ui/form";
import { Loader2, Plus, SquareArrowLeft } from "lucide-react";
import SuperadminLayout from "@/components/layout-superadmin";
import Link from "next/link";
import { useCreateSeason } from "../../_services/season";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().nonempty("Nama season wajib diisi"),
  logo: z.instanceof(File, { message: "Logo season wajib dipilih" }),
  banner: z.instanceof(File, { message: "Banner season wajib dipilih" }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateSeasonForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: undefined,
      banner: undefined,
    },
  });

  const createSeason = useCreateSeason();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo);
    formData.append("banner", data.banner);

    createSeason.mutate(
      {
        body: formData,
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menambahkan season"
          );

          // Handle validation errors
          if (error.status === 422) {
            const validationErrors = error.data.validation as Partial<
              Record<keyof FormData, string>
            >;

            Object.entries(validationErrors).forEach(([field, message]) => {
              if (message) {
                form.setError(field as keyof FormData, {
                  type: "manual",
                  message,
                });
              }
            });
          }
          
          setIsSubmitting(false);
        },
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Season berhasil ditambahkan");
          form.reset();
          router.push("/sa/manage-season");
        },
      }
    )
  };

  return (
    <SuperadminLayout>
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center space-x-2">
            <Link href={"/sa/manage-season"}>
              <SquareArrowLeft strokeWidth={1} />
            </Link>
            <h3 className="text-2xl font-bold">Tambahkan Season Baru</h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel required>Masukkan Nama Season</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Nama Season" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FileUpload
                      label="Logo Season"
                      required
                      accept="image/*"
                      selectedFile={value}
                      onFileSelect={onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FileUpload
                      label="Banner Season"
                      required
                      accept="image/*"
                      selectedFile={value}
                      onFileSelect={onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm font-medium text-black">
                *note : rekomendasi ukuran gambar 1440 px X 780 px
              </p>

              <Button
                type="submit"
                className="bg-blue-pfl hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tambahkan Season
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SuperadminLayout>
  );
}
