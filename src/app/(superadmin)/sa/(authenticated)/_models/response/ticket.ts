export interface TicketResponse {
    status: number;
    message: string;
    validation: Record<string, string> | null;
    data: Ticket | null;
}

export interface TicketResponseList {
    status: number;
    message: string;
    validation: Record<string, string> | null;
    data: Data | null;
}

export interface Data {
    limit: number;
    page: number;
    total: number;
    list: Ticket[] | null;
}

export interface Ticket {
    id: string;
    seriesId: string;
    name: string;
    date: string;
    price: number;
    quota: Quota;
    matchs: Match[] | null;
    createdAt: string;
    updatedAt: string;
}

export interface Quota {
    stock: number;
    used: number;
    remaining: number;
}

export interface Match {
    homeSeasonTeamId: string;
    homeSeasonTeam: SeasonTeam;
    awaySeasonTeamId: string;
    awaySeasonTeam: SeasonTeam;
    venueId: string;
    venue: Venue;
    time: string;
}

export interface Venue {
    id: string;
    name: string;
}

export interface SeasonTeam {
    id: string;
    seasonId: string;
    teamId: string;
    team: Team;
}

export interface Team {
    id: string;
    name: string;
    logo: string;
}