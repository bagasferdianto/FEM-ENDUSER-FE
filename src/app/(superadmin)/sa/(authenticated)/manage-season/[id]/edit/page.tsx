"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
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
import { Loader2, SquareArrowLeft } from "lucide-react";
import SuperadminLayout from "@/components/layout-superadmin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetSeasonById, useUpdateSeason } from "../../../_services/season";

const formSchema = z.object({
  name: z.string().nonempty("Nama season wajib diisi"),
  logo: z.union([z.instanceof(File), z.string()]).optional(),
  banner: z.union([z.instanceof(File), z.string()]).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditSeasonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSeasonForm({ params }: EditSeasonPageProps) {
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: season, isFetching } = useGetSeasonById(id);
  const updateSeason = useUpdateSeason();

  const [isLoading, setIsLoading] = useState(isFetching);

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: undefined,
      banner: undefined,
    },
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchSeason = async () => {
      if (!season?.data) return;
      form.reset({
        name: season.data.name,
        logo: season.data.logo.name,
        banner: season.data.banner.name,
      });

      setIsLoading(false);
    };

    fetchSeason();
  }, [season, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);

    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    }
    if (data.banner instanceof File) {
      formData.append("banner", data.banner);
    }

    updateSeason.mutate(
      {
        vars: { id: id },
        body: formData,
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat memperbarui season"
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
          toast.success("Season berhasil diperbarui");
          form.reset();
          router.push("/sa/manage-season");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data season...</p>
          </div>
        </div>
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center space-x-2">
            <Link href={"/sa/manage-season"}>
              <SquareArrowLeft strokeWidth={1} />
            </Link>
            <h3 className="text-2xl font-bold">Edit Season</h3>
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
                      accept="image/*"
                      selectedFile={value ?? null}
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
                      accept="image/*"
                      selectedFile={value ?? null}
                      onFileSelect={onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm font-medium text-black">
                *note : rekomendasi ukuran gambar 1440 px X 780 px
              </p>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-blue-pfl hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    "Perbarui Season"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SuperadminLayout>
  );
}
