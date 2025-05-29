export interface TeamResponse {
    status: number;
    message: string;
    data: Team | null;
    validation: Record<string, string> | null;
}

export interface TeamResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Team[] | null;
}

export interface Team {
    id: string;
    name: string;
    logo: Logo;
    createdAt: string;
    updatedAt: string;
}

export interface Logo {
  id: string
  name: string
  size: number
  url: string
  type: string
  isPrivate: boolean
  providerKey: string
}