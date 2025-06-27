export interface DashboardResponse {
  status: number;
  message: string;
  data: Dashboard | null;
  validation: Record<string, string> | null;
}

interface Dashboard {
    chartData: ChartData[];
    totalIncome: number;
    totalMatch: number;
    totalPurchase: number;
    totalSeriesPurchase: number;
    totalDayPurchase: number;
}

interface ChartData {
    month: string;
    value: number;
}
