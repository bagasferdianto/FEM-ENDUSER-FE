export interface PlayingTeamResponse {
    status: number;
    message: string;
    data: PlayingTeam | null;
    validation: Record<string, string> | null;
}

export interface PlayingTeamResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: PlayingTeam[] | null;
}

export interface PlayingTeam {
    id: string;
    seasonId: string;
    season: Season;
    teamId: string;
    team: Team;
    createdAt: string;
    updatedAt: string;
}

interface Season {
    id: string;
    name: string;
}

interface Team {
    id: string;
    name: string;
    logo: string;
}