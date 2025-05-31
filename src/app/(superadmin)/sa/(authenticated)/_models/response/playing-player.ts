export interface PlayingPlayerResponse {
    status: number;
    message: string;
    data: PlayingPlayer | null;
    validation: Record<string, string> | null;
}

export interface PlayingPlayerResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: PlayingPlayer[] | null;
}

export interface PlayingPlayer {
    id: string;
    seasonTeam: SeasonTeam;
    player: Player;
    position: string;
    image: Image;
    createdAt: string;
    updatedAt: string;
}

interface SeasonTeam {
    id: string;
    seasonId: string;
    teamId: string;
    team: Team;
}

interface Player {
    id: string;
    name: string;
}

interface Team {
    id: string;
    name: string;
    logo: string;
}

interface Image {
    id: string;
    name: string;
    size: number;
    url: string;
    type: string;
    isPrivate: boolean;
    providerKey: string;
}

export interface PlayerPositionResponse {
  status: number;
  message: string;
  data: string[] | null;
  validation: Record<string, string> | null;
}