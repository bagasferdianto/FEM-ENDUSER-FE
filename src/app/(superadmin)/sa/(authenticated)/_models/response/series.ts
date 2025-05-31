export interface SeriesResponse {
    status: number;
    message: string;
    validation: Record<string, string> | null;
    data: Series | null;
}

export interface SeriesResponseList {
    status: number;
    message: string;
    validation: Record<string, string> | null;
    data: Data | null;
}

export interface Data {
    limit: number;
    page: number;
    total: number;
    list: Series[] | null;
}

export interface Series {
    id: string;
    seasonId: string;
    season: Season;
    venueId: string;
    venue: Venue;
    name: string;
    price: number;
    startDate: string;
    endDate: string;
    status: StatusEnum;
    createdAt: string;
    updatedAt: string;
}

export interface Season {
    id: string;
    name: string;
}

export interface Venue {
    id: string;
    name: string;
}

export enum StatusEnum {
  Draft = "Draft",
  Active = "Active",
  NonActive = "Non-Active",
}

export enum StatusRequestEnum {
    Draft = 1,
    Active = 2,
    NonActive = 3,
}