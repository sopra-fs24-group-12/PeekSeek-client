import React from "react";


//import UI Elements
import BaseContainerLarge from "../ui/BaseContainerLarge";
import WinningCard from "../ui/WinningCard";
import Leaderboard from "../ui/Leaderboard";
import Timer from "../ui/Timer";

// Mock winning submission data
const mockWinningSubmission = {
  id: "1",
  cityName: "Rome",
  quest: "Locate the best sunrise spot",
  anonymousName: "Nils",
  imageUrl: "https://example.com/path/to/winning/image.jpg",
};

const mockLeaderboardData = [
  { rank: 1, name: 'Nils', basePoints: 100, bonusPoints: 50 },
  { rank: 2, name: 'Ece', basePoints: 90, bonusPoints: 45 },
  { rank: 3, name: 'Youssef', basePoints: 85, bonusPoints: 40 },
  { rank: 4, name: 'Georg', basePoints: 80, bonusPoints: 35 },
  { rank: 4, name: 'Silvan', basePoints: 80, bonusPoints: 35 },
  { rank: 4, name: 'Böhlen', basePoints: 80, bonusPoints: 35 },
];

// Mock initial time for the timer in seconds
const initialTime = 30;

const VotingResults = () => {

  //todo: use websockets for time. this is just a mock time
  const timeRemaining = 16


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
        <div className="mt-10 w-full relative">
          <div className="max-w-2xl mx-auto"> {/* Leaderboard centered */}
            <Leaderboard data={mockLeaderboardData} />
          </div>
          <div className="absolute right-0 top-0 mr-10"> {/* Position the Timer to the right of Leaderboard */}
            <Timer
              initialTimeInSeconds={initialTime}
              timeInSeconds={timeRemaining}
              title = "NEXT ROUND:"
            />
          </div>
        </div>
      </div>
    </BaseContainerLarge>
  );
};

export default VotingResults;
