export interface CandidateResponse {
  status: number;
  message: string;
  data: Candidate | null;
  validation: Record<string, string> | null;
}

export interface CandidateResponseList {
  status: number;
  message: string;
  validation: Record<string, string> | null;
  data: Data | null;
}

export interface Data {
  limit: number;
  page: number;
  total: number;
  list: Candidate[];
}

export interface Candidate {
  id: string;
  seasonTeamId: string;
  seasonTeam: SeasonTeam;
  seasonTeamPlayerId: string;
  seasonTeamPlayer: SeasonTeamPlayer;
  playerId: string;
  player: Player;
  position: string;
  performance: Performance;
  voters: Voters;
  createdAt: string;
  updatedAt: string;
}

export interface Voters {
  count: number;
  percentage: number;
}

export interface Performance {
  teamLeaderboard: number;
  goal: number;
  assist: number;
  save: number;
  score: number;
}

export interface SeasonTeam {
  id: string;
  teamId: string;
  team: Team;
}

export interface SeasonTeamPlayer {
  id: string;
  playerId: string;
  player: Player;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Player {
  id: string;
  name: string;
}
