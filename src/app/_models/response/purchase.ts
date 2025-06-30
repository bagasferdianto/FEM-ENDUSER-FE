import { Ticket } from "./ticket";

export interface PurchaseResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Purchase[] | null;
}

export interface PurchaseResponse {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Purchase | null;
}

export interface Purchase {
  id: string;
  member: MemberPurchase;
  season: Season;
  series: Series;
  tickets: Ticket[];
  amount: number;
  invoice: InvoicePurchase;
  price: number;
  grandTotal: number;
  isCheckoutPackage: boolean;
  expiredAt: string;
  paidAt: string | null;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;
}

interface MemberPurchase {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface InvoicePurchase {
  invoiceId: string;
  invoiceExternalId: string;
  invoiceUrl: string;
  paymentMethod: string;
  merchantName: string;
  bankCode: string;
  paymentChannel: string;
  paymentDestination: string;
}

interface Season {
  id: string;
  name: string;
}

interface Series {
  id: string;
  name: string;
}

export enum StatusEnum {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
}
