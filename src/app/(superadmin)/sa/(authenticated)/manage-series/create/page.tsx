"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SuperadminLayout from "@/components/layout-superadmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Plus, SquareArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  RequiredLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetVenues } from "../../_services/venue";
import { useCreateSeries } from "../../_services/series";
import { DatePicker } from "@/components/ui/date-picker";

const schema = z.object({
  name: z.string().nonempty("Nama series wajib diisi"),
  venueId: z.string().nonempty("Venue/tempat wajib dipilih"),
  price: z.coerce
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .min(0, "Harga tidak boleh negatif")
    .min(1, "Harga tidak boleh kosong"),
  startDate: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  endDate: z.date({ required_error: "Tanggal selesai wajib diisi" }),
});

type FormData = z.infer<typeof schema>;

export default function CreateSeriesForm() {
  // get venues for dropdown
  const venues = useGetVenues({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
  });
  const venuesList = venues.data?.data?.list || [];

  // handle create
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createSeries = useCreateSeries();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      venueId: "",
      price: 0,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const payload = {
      name: data.name,
      venueId: data.venueId,
      price: data.price,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    };

    createSeries.mutate(
      {
        body: payload,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Series berhasil ditambahkan");
          form.reset();
          router.push(`/sa/manage-series`);
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menambahkan series"
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
        },
      }
    );
  };

  return (
    <SuperadminLayout>
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center space-x-2">
            <Link href={"/sa/manage-series"}>
              <SquareArrowLeft strokeWidth={1} />
            </Link>
            <h3 className="text-2xl font-bold">Tambahkan Series Baru</h3>
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
                    <RequiredLabel required>Masukkan Nama Series</RequiredLabel>
                    <FormControl>
                      <Input placeholder="Nama Series" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <RequiredLabel>Pilih Tempat Series</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Tempat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto w-full">
                        {venuesList.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel required>
                      Masukkan Harga Series
                    </RequiredLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan harga series disini"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Tanggal Mulai Series</RequiredLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Tanggal Berakhir Series</RequiredLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-blue-pfl hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tambahkan Series
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SuperadminLayout>
  );
}
