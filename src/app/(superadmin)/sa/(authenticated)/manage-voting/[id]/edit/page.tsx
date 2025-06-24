"use client";

import type React from "react";
import { use, useEffect, useState } from "react";
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
  FormLabel,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, SquareArrowLeft } from "lucide-react";
import SuperadminLayout from "@/components/layout-superadmin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { useGetVotingById, useUpdateVoting } from "../../../_services/voting";
import { StatusRequestEnum } from "../../../_models/response/voting";
import { useGetSeries } from "../../../_services/series";
import { mapStatusStringToEnumValue } from "../../../_utils/voting";
import { useGetActiveSeason } from "../../../_services/season";
import { Season } from "../../../_models/response/season";

const formSchema = z.object({
  title: z.string().nonempty("Judul voting wajib diisi"),
  seriesId: z.string().nonempty("Series wajib dipilih"),
  startDate: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  endDate: z.date({ required_error: "Tanggal selesai wajib diisi" }),
  goalPoint: z.coerce
    .number({ invalid_type_error: "Poin goal harus berupa angka" })
    .min(0, "Poin goal tidak boleh negatif"),
  assistPoint: z.coerce
    .number({ invalid_type_error: "Poin assist harus berupa angka" })
    .min(0, "Poin assist tidak boleh negatif"),
  savePoint: z.coerce
    .number({ invalid_type_error: "Poin save harus berupa angka" })
    .min(0, "Poin save tidak boleh negatif"),
  banner: z.union([z.instanceof(File), z.string()]).optional(),
  status: z.string().refine((val) => ["1", "2", "3"].includes(val), {
    message: "Status tidak valid",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface EditVotingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditVotingForm({ params }: EditVotingPageProps) {
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: voting, isFetching } = useGetVotingById(id);

  const [isLoading, setIsLoading] = useState(isFetching);

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      seriesId: "",
      startDate: undefined,
      endDate: undefined,
      goalPoint: 4,
      assistPoint: 2,
      savePoint: 5,
      banner: undefined,
      status: StatusRequestEnum.NonActive.toString(),
    },
  });

  const updateVoting = useUpdateVoting();
  const { data: season, isFetching: isFetchingSeason } = useGetActiveSeason();
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  useEffect(() => {
    if (!isFetching) {
      if (season?.status === 400) {
        setActiveSeason(null);
        toast.error("Tidak terdapat season active");
        router.push("/sa/manage-season");
      } else {
        setActiveSeason(season?.data || null);
        if (!season?.data) {
          toast.error("Tidak terdapat season active");
          router.push("/sa/manage-season");
        }
      }
    }
  }, [season, router, isFetching]);

  const { data } = useGetSeries({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
    seasonId: activeSeason?.id || "none",
  });
  const seriesList = data?.data?.list ?? [];

  useEffect(() => {
    const fetchVoting = async () => {
      if (!voting?.data) return;
      form.reset({
        title: voting.data.title,
        seriesId: voting.data.seriesId,
        startDate: new Date(voting.data.startDate),
        endDate: new Date(voting.data.endDate),
        goalPoint: voting.data.performancePoint.goal,
        assistPoint: voting.data.performancePoint.assist,
        savePoint: voting.data.performancePoint.save,
        banner: voting.data.banner.name,
        status: mapStatusStringToEnumValue(voting.data.status),
      });
      setIsLoading(false);
    };
    fetchVoting();
  }, [voting, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("seriesId", data.seriesId);
    formData.append("startDate", data.startDate.toISOString());
    formData.append("endDate", data.endDate.toISOString());
    formData.append("goalPoint", data.goalPoint.toString());
    formData.append("assistPoint", data.assistPoint.toString());
    formData.append("savePoint", data.savePoint.toString());
    formData.append("status", data.status);
    if (data.banner instanceof File) {
      formData.append("banner", data.banner);
    }

    updateVoting.mutate(
      {
        vars: { id: id },
        body: formData,
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat memperbarui voting"
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
          toast.success("Voting berhasil diperbarui");
          form.reset();
          router.push("/sa/manage-voting");
        },
      }
    );
  };

  if (isLoading && isFetchingSeason) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data voting...</p>
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
            <Link href={"/sa/manage-voting"}>
              <SquareArrowLeft strokeWidth={1} />
            </Link>
            <h3 className="text-2xl font-bold"> Tambah Voting Baru </h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <RequiredLabel> Judul Voting </RequiredLabel>
                    <FormControl>
                      <Input placeholder="Judul voting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="seriesId"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <RequiredLabel>Pilih Series</RequiredLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Series" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {seriesList.map((series) => (
                            <SelectItem key={series.id} value={series.id}>
                              {series.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-end gap-8">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Periode Voting</RequiredLabel>
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
                <div className="pb-3">–</div>
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel className="invisible">
                        Sampai
                      </RequiredLabel>
                      {""}
                      {/* Untuk align */}
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
              </div>

              <FormField
                control={form.control}
                name="banner"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FileUpload
                      label="Banner Voting"
                      required
                      accept="image/*"
                      selectedFile={value ?? null}
                      onFileSelect={onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm font-medium text-black">
                *note : rekomendasi ukuran gambar 1440 px X 480 px
              </p>
              <div className="space-y-2">
                <p className="text-md font-medium text-black">
                  Tentukan Skor Peforma
                </p>
                <FormField
                  control={form.control}
                  name="goalPoint"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-x-2">
                        <RequiredLabel className="w-1/6"> Goal :</RequiredLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Poin Goal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assistPoint"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-x-2">
                        <RequiredLabel className="w-1/6">
                          {" "}
                          Assist :
                        </RequiredLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Poin Assist"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="savePoint"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-x-2">
                        <RequiredLabel className="w-1/6"> Save :</RequiredLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Poin Save"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <RequiredLabel>Status</RequiredLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={onChange}
                        value={value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={StatusRequestEnum.NonActive.toString()}
                            />
                          </FormControl>
                          <FormLabel>Non-Active</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={StatusRequestEnum.ComingSoon.toString()}
                            />
                          </FormControl>
                          <FormLabel>Coming Soon</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={StatusRequestEnum.Active.toString()}
                            />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                Perbarui Voting
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SuperadminLayout>
  );
}
