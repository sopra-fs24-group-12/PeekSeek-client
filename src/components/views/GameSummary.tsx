import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import Leaderboard from "../ui/Leaderboard";


const mockLeaderboardData = [
  { rank: 1, name: "Nils", basePoints: 100, bonusPoints: 50 },
  { rank: 2, name: "Ece", basePoints: 90, bonusPoints: 45 },
  { rank: 3, name: "Youssef", basePoints: 85, bonusPoints: 40 },
  { rank: 4, name: "Georg", basePoints: 80, bonusPoints: 35 },
  { rank: 5, name: "Silvan", basePoints: 70, bonusPoints: 5 },
  { rank: 6, name: "Böhlen", basePoints: 60, bonusPoints: 0 },
];


const GameSummary = () => {
  // Mock data for city and number of quests
  const [city, setCity] = useState("Rome");
  const [nrOfQuests, setNrOfQuests] = useState(5);

  return (
    <BaseContainer size="large" className="flex flex-col items-center">
      <div className="text-center p-4 w-full">
        <h1 className="text-3xl font-bold text-gray-700">You&apos;ve just explored {city} in {nrOfQuests} Quests!</h1>
      </div>
      <div className='flex w-full'>
        <div className='w-1/2 p-4'>
          {/* Button links will be added here */}
        </div>
        <div className='w-1/2 flex flex-col p-4'> {/* Right part for Leaderboard and Google Maps */}
          <Leaderboard data={mockLeaderboardData} />
          <div
            id="google-maps-container"
            className="aspect-w-2 aspect-h-3 bg-gray-200 mt-4 rounded-lg cursor-pointer"
            onClick={() => console.log('Clicked onto map with Winning Submissions!')}
          >
            {/* Placeholder for Map with Winning Submissions */}
            <p className="text-center text-gray-500 pt-20">Google Maps</p>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
}

export default GameSummary;