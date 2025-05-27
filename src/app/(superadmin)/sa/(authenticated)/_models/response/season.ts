export interface SeasonResponse {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Season | null;
}

export interface SeasonResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Season[] | null;
}

export interface Season {
  id: string;
  name: string;
  status: StatusEnum;
  logo: Logo
  banner: Banner
  createdAt: string
  updatedAt: string
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

export interface Banner {
  id: string
  name: string
  size: number
  url: string
  type: string
  isPrivate: boolean
  providerKey: string
}

export enum StatusEnum {
  Active = "Active",
  Inactive = "Inactive",
}

export enum StatusRequestEnum {
    Active = 1,
    Inactive = 2,
}