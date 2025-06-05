"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { useGetSeriesById } from "../../../_services/series";
import { use, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetActiveSeason } from "../../../_services/season";
import { useGetPlayingTeams } from "../../../_services/playing-team";
import {
  useCreateorUpdateTicket,
  useDeleteTicket,
  useGetTickets,
} from "../../../_services/ticket";
import type { TicketResponseList } from "../../../_models/response/ticket";
import { formatDateToLocalISOString, formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { useQueryClient } from "react-ohttp";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const matchSchema = z
  .object({
    homeSeasonTeamId: z.string().nonempty("Silahkan pilih home team"),
    awaySeasonTeamId: z.string().nonempty("Silahkan pilih away team"),
    time: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid"),
  })
  .refine((data) => data.homeSeasonTeamId !== data.awaySeasonTeamId, {
    message: "Home team dan away team tidak boleh sama",
    path: ["awaySeasonTeamId"],
  });

const ticketSchema = z.object({
  id: z.string().optional(),
  apiId: z.string().optional(),
  name: z.string().nonempty("Nama tiket wajib diisi"),
  date: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  price: z.number().min(1, "Harga wajib diisi"),
  quota: z.number().min(1, "Kuota tiket wajib diisi"),
  matchs: z.array(matchSchema).min(1, "Setidaknya ada satu pertandingan"),
});

const schema = z.object({
  seriesId: z.string(),
  tickets: z.array(ticketSchema).min(1, "At least one ticket day is required"),
});

type FormData = z.infer<typeof schema>;

interface ManageSchedulePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ManageSchedule({ params }: ManageSchedulePageProps) {
  // fetch active season
  const { data: season, isFetching: isFetchingSeason } = useGetActiveSeason();

  // fetch series by id
  const { id } = use(params);
  const { data: series, isFetching: isFetchingSeries } = useGetSeriesById(id);

  // fetch seasonTeams for dropdown
  const { data: seasonTeams, isFetching: isFetchingSeasonTeams } =
    useGetPlayingTeams({
      seasonId: season?.data?.id || "none",
      limit: "1000",
      sort: "createdAt",
      dir: "desc",
    });
  const seasonTeamsList = seasonTeams?.data?.list || [];

  // fetch tickets list
  const { data: tickets, isFetching: isFetchingTickets } = useGetTickets({
    seriesId: series?.data?.id || "none",
    limit: "1000",
    sort: "date",
    dir: "asc",
  });

  //handle form
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      seriesId: series?.data?.id || "",
      tickets: [
        {
          id: "",
          apiId: undefined,
          name: "Day 1",
          date: undefined,
          price: 0,
          quota: 0,
          matchs: [
            {
              homeSeasonTeamId: "",
              awaySeasonTeamId: "",
              time: "00:00",
            },
          ],
        },
      ],
    },
  });

  const {
    fields: ticketFields,
    append: appendTicket,
    remove: removeTicket,
  } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  // ticket useHttp
  const { mutate: createOrUpdateTicket, isPending } = useCreateorUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const router = useRouter();
  const queryClient = useQueryClient();

  // delete ticket dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<{
    apiId?: string;
    index: number;
    name: string;
    isFromApi: boolean;
  } | null>(null);

  // transform response to form data
  const transformRespToData = useCallback(
    (data: TicketResponseList): FormData => {
      if (!data.data?.list || data.data.list.length === 0)
        return form.getValues();
      return {
        seriesId: series?.data?.id || "",
        tickets: data.data.list.map((ticket) => ({
          id: ticket.id,
          apiId: ticket.id,
          name: ticket.name,
          date: new Date(ticket.date),
          price: ticket.price,
          quota: ticket.quota.stock,
          matchs:
            ticket.matchs?.map((match) => ({
              homeSeasonTeamId: match.homeSeasonTeamId,
              awaySeasonTeamId: match.awaySeasonTeamId,
              time: match.time,
            })) || [],
        })),
      };
    },
    [form, series]
  );

  // initialize data
  useEffect(() => {
    const fetchTickets = async () => {
      if (!tickets?.data || !series?.data?.id) return;
      form.reset(transformRespToData(tickets));
    };
    fetchTickets();
  }, [tickets, form, transformRespToData, series]);

  // set loading page
  if (
    isFetchingSeason ||
    isFetchingSeries ||
    isFetchingSeasonTeams ||
    isFetchingTickets
  ) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data tiket...</p>
          </div>
        </div>
      </SuperadminLayout>
    );
  }

  // add match func
  const addMatch = (ticketIndex: number) => {
    const currentMatch = form.getValues().tickets[ticketIndex].matchs;
    form.setValue(`tickets.${ticketIndex}.matchs`, [
      ...currentMatch,
      { homeSeasonTeamId: "", awaySeasonTeamId: "", time: "00:00" },
    ]);
  };

  // remove match func
  const removeMatch = (ticketIndex: number, matchIndex: number) => {
    const currentMatches = form.getValues().tickets[ticketIndex].matchs;
    if (currentMatches.length > 1) {
      const newMatches = currentMatches.filter(
        (_, index) => index !== matchIndex
      );
      form.setValue(`tickets.${ticketIndex}.matchs`, newMatches);
    }
  };

  // add ticket day func
  const addTicketDay = () => {
    const newDay = ticketFields.length + 1;
    appendTicket({
      id: "",
      apiId: undefined,
      name: `Day ${newDay}`,
      date: new Date(),
      price: 0,
      quota: 0,
      matchs: [
        {
          homeSeasonTeamId: "",
          awaySeasonTeamId: "",
          time: "00:00",
        },
      ],
    });
  };

  // handle submit
  const onSubmit = async (data: FormData) => {
    const payload = {
      seriesId: data.seriesId,
      tickets: data.tickets.map((ticket) => ({
        id: ticket.apiId, // Use apiId for the API call
        name: ticket.name,
        date: formatDateToLocalISOString(ticket.date),
        price: ticket.price,
        quota: ticket.quota,
        matchs: ticket.matchs.map((match) => ({
          homeSeasonTeamId: match.homeSeasonTeamId,
          awaySeasonTeamId: match.awaySeasonTeamId,
          time: match.time,
        })),
      })),
    };

    createOrUpdateTicket(
      {
        body: payload,
      },
      {
        onSuccess: () => {
          toast.success("Data tiket berhasil disimpan");
          form.reset();
          router.push(`/sa/manage-series/${series?.data?.id}/ticket`);
        },
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menyimpan data"
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

  // handle delete ticket
  const handleDeleteClick = (ticketIndex: number) => {
    const ticket = form.getValues().tickets[ticketIndex];
    const isFromApi = !!ticket.apiId;

    setTicketToDelete({
      apiId: ticket.apiId,
      index: ticketIndex,
      name: ticket.name,
      isFromApi,
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!ticketToDelete) return;

    if (ticketToDelete.isFromApi && ticketToDelete.apiId) {
      deleteTicket.mutate(
        {
          vars: { id: ticketToDelete.apiId },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setTicketToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus ticket"
            );
          },
          onSuccess: () => {
            toast.success(`Ticket berhasil dihapus`);
            setDeleteDialogOpen(false);
            setTicketToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/tickets"],
            });
          },
        }
      );
    } else {
      // Frontend ticket deletion
      removeTicket(ticketToDelete.index);
      toast.success("Tiket berhasil dihapus");
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <div className="space-x-2 flex flex-row items-center">
            <h1 className="text-2xl font-bold">{series?.data?.name}</h1>
            <Tag className="h-4 w-4" strokeWidth={0.5} />
            <p className="text-gray-700">
              Harga Tiket Series : {formatRupiah(series?.data?.price || 0)}
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {ticketFields.map((ticket, ticketIndex) => {
              return (
                <div className="space-y-4" key={ticket.id}>
                  <div className="space-y-4 flex flex-row text-lg w-full justify-between">
                    <FormField
                      control={form.control}
                      name={`tickets.${ticketIndex}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-xl md:text-2xl lg:text-2xl font-semibold border-none p-0 h-auto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      className="text-white bg-red-600"
                      onClick={() => handleDeleteClick(ticketIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                      Hapus Match Day
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name={`tickets.${ticketIndex}.apiId`}
                        render={({ field }) => (
                          <input
                            type="hidden"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <FormField
                          control={form.control}
                          name={`tickets.${ticketIndex}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Harga Tiket{" "}
                                {form.watch(`tickets.${ticketIndex}.name`)}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Harga Tiket"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number(e.target.value) || undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tickets.${ticketIndex}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Tanggal{" "}
                                {form.watch(`tickets.${ticketIndex}.name`)}
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  className="w-full"
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
                          name={`tickets.${ticketIndex}.quota`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Kuota{" "}
                                {form.watch(`tickets.${ticketIndex}.name`)}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Jumlah Kuota"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number(e.target.value) || undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-4">
                        {form
                          .watch(`tickets.${ticketIndex}.matchs`)
                          .map((match, matchIndex) => (
                            <div
                              key={matchIndex}
                              className="space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                  Pertandingan {matchIndex + 1}
                                </h4>
                                {form.watch(`tickets.${ticketIndex}.matchs`)
                                  .length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeMatch(ticketIndex, matchIndex)
                                    }
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <FormField
                                    control={form.control}
                                    name={`tickets.${ticketIndex}.matchs.${matchIndex}.homeSeasonTeamId`}
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Pilih Tim" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 overflow-y-auto w-full">
                                              {seasonTeamsList.map((team) => (
                                                <SelectItem
                                                  key={team.id}
                                                  value={team.id}
                                                >
                                                  {team.team.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white bg-[#DC2626] rounded-full">
                                  Vs
                                </div>

                                <div className="flex-1">
                                  <FormField
                                    control={form.control}
                                    name={`tickets.${ticketIndex}.matchs.${matchIndex}.awaySeasonTeamId`}
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <FormControl>
                                          <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Pilih Tim" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 overflow-y-auto w-full">
                                              {seasonTeamsList.map((team) => (
                                                <SelectItem
                                                  key={team.id}
                                                  value={team.id}
                                                >
                                                  {team.team.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>

                              <FormField
                                control={form.control}
                                name={`tickets.${ticketIndex}.matchs.${matchIndex}.time`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="time"
                                          {...field}
                                          className="w-32"
                                        />
                                        <span className="text-sm text-gray-500">
                                          WIB
                                        </span>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}

                        <Button
                          type="button"
                          onClick={() => addMatch(ticketIndex)}
                          className="gap-2 text-white bg-blue-pfl hover:bg-blue-800"
                        >
                          Tambah Pertandingan
                          <Plus className="h-4 w-4 mr-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
            <Button
              type="button"
              onClick={addTicketDay}
              variant="outline"
              className="text-white bg-blue-pfl hover:bg-blue-800 mt-4"
            >
              Tambah Hari Pertandingan
            </Button>
            <div className="flex w-full justify-end mt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-pfl hover:bg-blue-800 gap-2 text-white"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? "Menyimpan..." : "Simpan Pengaturan Jadwal"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Tiket `{ticketToDelete?.name}
              `?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {ticketToDelete?.isFromApi
                ? "Tiket ini akan dihapus dari database dan tidak dapat dikembalikan."
                : "Tiket ini akan dihapus dari form."}
            </p>
            {ticketToDelete?.isFromApi && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  ⚠️ Perhatian: Ini adalah tiket yang sudah tersimpan di
                  database
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-start gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setTicketToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteTicket.isPending}
            >
              {deleteTicket.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperadminLayout>
  );
}
