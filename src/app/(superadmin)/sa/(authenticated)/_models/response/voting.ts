export interface VotingResponse {
    status: number;
    message: string;
    data: Voting | null;
    validation: Record<string, string> | null;
}

export interface VotingResponseList {
    status: number;
    message: string;
    validation: Record<string, string> | null;
    data: Data | null;
}

export interface Data {
    limit: number;
    page: number;
    total: number;
    list: Voting[] | null;
}

export interface Voting {
    id: string;
    title: string;
    seriesId: string;
    series: Series;
    status: StatusEnum;
    banner: Banner;
    startDate: string;
    endDate: string;
    performancePoint: PerformancePoint;
    totalVoter: number;
    createdAt: string;
    updatedAt: string;
}

export interface Series {
    id: string;
    name: string;
}

interface PerformancePoint {
    goal: number;
    assist: number;
    save: number;
}

export interface Banner {
    id: string;
    name: string;
    size: number;
    url: string;
    type: string;
    isPrivate: boolean;
    providerKey: string;
}

export enum StatusEnum {
    ComingSoon = "Coming Soon",
    Active = "Active",
    NonActive = "Non-Active",
}

export enum StatusRequestEnum {
    Active = 1,
    NonActive = 2,
    ComingSoon = 3,
}
