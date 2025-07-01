export interface VotingResponse {
    status: number;
    message: string;
    validation: Record<string, string> | null;
    data: Voting | null;
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
  startDate: string;
  endDate: string;
  series: {
    id: string;
    name: string;
  };
  performancePoint: {
    goal: number;
    assist: number;
    save: number;
  };
  totalVoter: number;
  banner: {
    id: string;
    name: string;
    size: number;
    url: string;
    type: string;
    isPrivate: boolean;
    providerKey: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}