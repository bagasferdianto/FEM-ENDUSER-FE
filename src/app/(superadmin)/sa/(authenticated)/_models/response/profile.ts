export interface ProfileResponse {
  status: number;
  message: string;
  data: Data | null;
}

export interface Data {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}