import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTeams } from "../../_services/team";
import { useEffect, useState } from "react";
import { Team } from "../../_models/response/team";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useManagePlayingTeam } from "../../_services/playing-team";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/pagination/page";
import { Loader2, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryClient } from "react-ohttp";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageTeamsDialog({ open, onOpenChange }: Props) {
  // fetch teams data
  const [teamsData, setTeams] = useState<Team[]>([]);
  const [page, setPage] = useState(1);
  const [initialSelectedIds, setInitialSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 500);

  const { data: teams, isFetching } = useGetTeams({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
    seasonId: "active",
    search: debounceSearch,
  });

  useEffect(() => {
    if (!isFetching) {
      setTeams(teams?.data?.list || []);
      const selected = teamsData.filter((t) => t.isSelected).map((t) => t.id);
      setInitialSelectedIds(selected);
    }
  }, [isFetching, teams, teamsData]);

  const teamsList = teamsData || [];
  const totalItems = teams?.data?.total || 0;
  const itemsPerPage = teams?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // handle manage teams
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const schema = z.object({
    addedTeamIds: z.array(z.string()),
    removedTeamIds: z.array(z.string()),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      addedTeamIds: [],
      removedTeamIds: [],
    },
  });

  const { setValue, watch } = form;

  const handleToggle = (team: Team, checked: boolean) => {
    const { addedTeamIds, removedTeamIds } = form.getValues();

    const wasInitiallySelected = initialSelectedIds.includes(team.id);

    if (wasInitiallySelected && !checked) {
      // Was selected, now unselected
      setValue(
        "removedTeamIds",
        Array.from(new Set([...removedTeamIds, team.id]))
      );
      setValue(
        "addedTeamIds",
        addedTeamIds.filter((id) => id !== team.id)
      );
    } else if (!wasInitiallySelected && checked) {
      // Was unselected, now selected
      setValue("addedTeamIds", Array.from(new Set([...addedTeamIds, team.id])));
      setValue(
        "removedTeamIds",
        removedTeamIds.filter((id) => id !== team.id)
      );
    } else {
      // No change in final state (user reverts toggle)
      setValue(
        "addedTeamIds",
        addedTeamIds.filter((id) => id !== team.id)
      );
      setValue(
        "removedTeamIds",
        removedTeamIds.filter((id) => id !== team.id)
      );
    }
  };

  const managePlayingTeam = useManagePlayingTeam();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    managePlayingTeam.mutate(
      {
        body: data,
      },
      {
        onSuccess: () => {
          toast.success("Perubahan berhasil disimpan");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/season-teams"],
          })
          onOpenChange(false);
          setIsSubmitting(false);
        },
        onError: () => {
          toast.error("Terjadi kesalahan saat menyimpan perubahan");
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Manajemen Tim yang Bermain
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Cari Tim"
            value={search as string}
            onChange={(e) => setSearch(e.target.value)}
          />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col justify-center items-center"
          >
            <div className="max-h-[300px] overflow-y-auto space-y-4 w-full">
              {teamsList.map((team) => {
                const checked = (() => {
                  if (initialSelectedIds.includes(team.id)) {
                    return !watch("removedTeamIds").includes(team.id);
                  } else {
                    return watch("addedTeamIds").includes(team.id);
                  }
                })();

                return (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={team.id}
                      checked={checked}
                      onCheckedChange={(value) =>
                        handleToggle(team, value as boolean)
                      }
                    />
                    <Image
                      src={team.logo.url}
                      alt={`Logo ${team.name}`}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded"
                    />
                    <label htmlFor={team.id} className="text-sm font-medium">
                      {team.name}
                    </label>
                  </div>
                );
              })}
            </div>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />

            <Button
              className="bg-blue-pfl flex items-center justify-center text-white w-min"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tambahkan Team
              <Plus className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
