import React from "react";


//import UI Elements
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

const mockLeaderboardData = [
  { rank: 1, name: 'Player 1', basePoints: 100, bonusPoints: 50 },
  { rank: 2, name: 'Player 2', basePoints: 90, bonusPoints: 45 },
  { rank: 3, name: 'Player 3', basePoints: 85, bonusPoints: 40 },
  { rank: 4, name: 'Player 4', basePoints: 80, bonusPoints: 35 },
];

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
        <div className="mt-10 w-full">
          <Leaderboard data={mockLeaderboardData} />
        </div>
      </div>
    </BaseContainerLarge>
  );
};

export default VotingResults;
