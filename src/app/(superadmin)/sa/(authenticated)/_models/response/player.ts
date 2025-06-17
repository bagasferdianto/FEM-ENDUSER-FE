export interface PlayerResponse {
    status: number;
    message: string;
    data: Player | null;
    validation: Record<string, string> | null;
}

export interface PlayerResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Player[] | null;
}

export interface Player {
    id: string;
    name: string;
    stageName: string | null;
    createdAt: string;
    updatedAt: string;
}