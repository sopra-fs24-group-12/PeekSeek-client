import React from "react";
import BaseContainerLarge from "../ui/BaseContainerLarge";
import WinningCard from "../ui/WinningCard";
import Leaderboard from "../ui/Leaderboard";

// Mock winning submission data
const mockWinningSubmission = {
  id: "1",
  cityName: "Rome",
  quest: "Locate the best sunrise spot",
  anonymousName: "Nils",
  imageUrl: "https://example.com/path/to/winning/image.jpg",
};

const VotingResults = () => {
  return (
    <BaseContainerLarge>
      <div className="flex flex-col items-center justify-center w-full">
        <WinningCard
          key={mockWinningSubmission.id}
          cityName={mockWinningSubmission.cityName}
          quest={mockWinningSubmission.quest}
          anonymousName={mockWinningSubmission.anonymousName}
          imageUrl={mockWinningSubmission.imageUrl}
        />
        {/* Optionally, include the leaderboard below or wherever suitable */}
        <div className="mt-10 w-full">
          <Leaderboard />
        </div>
      </div>
    </BaseContainerLarge>
  );
};

export default VotingResults;
