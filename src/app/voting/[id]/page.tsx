"use client";

import EndedVote from "../_components/ended-vote";
import RunningVote from "../_components/running-vote";

const VotingPage = () => {
  const isEnded = false;

  if (isEnded) {
    return <EndedVote />;
  } else {
    return <RunningVote />;
  }
};

export default VotingPage;
