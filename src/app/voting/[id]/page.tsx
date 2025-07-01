"use client";

import { useGetVotingById } from "@/app/_services/voting";
import EndedVote from "../_components/ended-vote";
import RunningVote from "../_components/running-vote";
import { use, useEffect, useState } from "react";
import { useGetCandidate } from "@/app/_services/candidate";
import MemberLayout from "@/components/layout-member";
import LoadingCard from "@/components/ui/loading";

interface VotingPageProps {
  params: Promise<{
    id: string;
  }>;
}

const VotingPage = ({ params }: VotingPageProps) => {
  const { id } = use(params);
  const { data: voting, isFetching: isFetchingVoting } = useGetVotingById(id);
  const { data: candidates, isFetching: isFetchingCandidates } =
    useGetCandidate({ votingId: id });

  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (voting?.data) {
      const now = new Date().getTime();
      const end = voting?.data?.endDate
        ? new Date(voting.data.endDate).getTime()
        : 0;
      if (now > end) {
        setIsEnded(true);
      }
    }
  }, [voting]);

  const candidateList = candidates?.data?.list || [];

  if (isFetchingVoting || isFetchingCandidates) {
    return (
      <MemberLayout withFooter>
        <LoadingCard loadingMessage="Memuat data kandidat..." />
      </MemberLayout>
    );
  }

  if (isEnded) {
    return (
      <EndedVote candidates={candidateList} voting={voting?.data ?? null} />
    );
  } else {
    return (
      <RunningVote candidates={candidateList} voting={voting?.data ?? null} />
    );
  }
};

export default VotingPage;
