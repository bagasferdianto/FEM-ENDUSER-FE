export interface PurchaseResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Purchase[];
}

export interface Purchase {
    id: string;
    member: MemberPurchase;
    seasonId: string;
    seriesId: string;
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

export enum StatusEnum {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed"
}