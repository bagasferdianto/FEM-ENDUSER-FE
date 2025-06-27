"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DollarSign, FlagTriangleRight, Banknote } from "lucide-react";
import SuperadminLayout from "@/components/layout-superadmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSeasons } from "../_services/season";
import { useGetDashboard } from "../_services/dashboard";
import { useEffect, useMemo, useState } from "react";
import LoadingCard from "@/components/ui/loading";
import { formatRupiah } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  const { data: seasons, isFetching: isFetchingSeason } = useGetSeasons({
    page: "1",
    sort: "status",
    dir: "asc",
    limit: "100",
  });

  const seasonsList = useMemo(() => seasons?.data?.list || [], [seasons]);

  useEffect(() => {
    if (!selectedSeason && seasonsList.length > 0) {
      setSelectedSeason(seasonsList[0].id);
    }
  }, [selectedSeason, seasonsList]);

  const { data: dashboard, isFetching: isFetchingDashboard } = useGetDashboard({
    seasonId: selectedSeason,
  });

  const dashboardData = useMemo(() => dashboard?.data || null, [dashboard]);

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value);
  };

  if (isFetchingSeason || isFetchingDashboard) {
    return (
      <SuperadminLayout>
        <LoadingCard loadingMessage="Memuat data dashboard..." />
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm font-medium">
                Filter Berdasarkan Season
              </span>
              <Select onValueChange={handleSeasonChange} value={selectedSeason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter berdasarkan season" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto w-full">
                  {seasonsList.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Transaksi
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalPurchase ?? 0} Transaksi
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Pendapatan
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatRupiah(dashboardData?.totalIncome ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Pertandingan Terlaksana
              </CardTitle>
              <FlagTriangleRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalMatch ?? 0} Pertandingan
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Penjualan Tiket Series
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalSeriesPurchase ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Penjualan Tiket Harian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.totalDayPurchase ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="value" fill="var(--pfl-blue)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperadminLayout>
  );
}
