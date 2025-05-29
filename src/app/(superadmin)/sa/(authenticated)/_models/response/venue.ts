export interface VenueResponse {
    status: number;
    message: string;
    data: Venue | null;
    validation: Record<string, string> | null;
}

export interface VenueResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Venue[] | null;
}

export interface Venue {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}