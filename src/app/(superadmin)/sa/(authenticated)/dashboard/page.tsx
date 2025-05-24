"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DollarSign, FlagTriangleRight, Banknote } from "lucide-react";
import SuperadminLayout from "@/components/layout-superadmin";

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 2500 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4200 },
  { name: "May", value: 3800 },
  { name: "Jun", value: 2200 },
  { name: "Jul", value: 1800 },
  { name: "Aug", value: 4800 },
  { name: "Sep", value: 4000 },
  { name: "Oct", value: 4300 },
  { name: "Nov", value: 6000 },
  { name: "Dec", value: 5200 },
];

export default function DashboardPage() {
  return (
    <SuperadminLayout>
      <div className="space-y-6">
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
              <div className="text-2xl font-bold">500 Transasksi</div>
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
              <div className="text-2xl font-bold">Rp3.500.000</div>
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
              <div className="text-2xl font-bold">70 Pertandingan</div>
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
              <div className="text-2xl font-bold">529</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Penjualan Tiket Harian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
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
                <BarChart data={data}>
                  <XAxis dataKey="name" />
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
