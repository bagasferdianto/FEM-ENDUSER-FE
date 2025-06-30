export interface TicketPurchaseResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: TicketPurchase[] | null;
}

export interface TicketPurchaseResponse {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: TicketPurchase | null;
}

export interface TicketPurchase {
  id: string;
  member: MemberTicketPurchase;
  ticket: Ticket;
  venue: Venue;
  purchaseId: string;
  code: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MemberTicketPurchase {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Ticket {
  id: string;
  name: string;
  date: string;
  venueId: string;
}

interface Venue {
  id: string;
  name: string;
}