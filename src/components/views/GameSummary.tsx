import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import Leaderboard from "../ui/Leaderboard";
import ExternalLinkButton from "../ui/ExternalLinkButton";
import BackDashboardButton from "../ui/BackDashboardButton";


const mockLeaderboardData = [
  { rank: 1, name: "Nils", basePoints: 100, bonusPoints: 50 },
  { rank: 2, name: "Ece", basePoints: 90, bonusPoints: 45 },
  { rank: 3, name: "Youssef", basePoints: 85, bonusPoints: 40 },
  { rank: 4, name: "Georg", basePoints: 80, bonusPoints: 35 },
  { rank: 5, name: "Silvan", basePoints: 70, bonusPoints: 5 },
  { rank: 6, name: "Böhlen", basePoints: 60, bonusPoints: 0 },
];

const externalLinks = [
  {
    url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu",
    label: "Winning Submission 1",
  },
  {
    url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu",
    label: "Winning Submission 2",
  },
  {
    url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu",
    label: "Winning Submission 3",
  },
  {
    url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu",
    label: "Winning Submission 4",
  },
  {
    url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu",
    label: "Winning Submission 5",
  },
];
const GameSummary = () => {
  // Mock data for city and number of quests
  const [city, setCity] = useState("Rome");
  const [nrOfQuests, setNrOfQuests] = useState(5);

  return (
    <BaseContainer size="large" className="flex flex-col items-center">
      <div className="p-4 flex w-full items-center">
        <div className="w-1/6">
          <BackDashboardButton />
        </div>
        <div className="w-2/3 text-center">
          <h1 className="text-3xl font-bold text-gray-700">You&apos;ve just explored {city} in {nrOfQuests} Quests!</h1>
        </div>
        <div className="w-1/6">
        </div>
      </div>
      <div className="flex w-full">
        <div className="w-1/3 p-4 flex flex-col items-center justify-end h-full space-y-4">
          {externalLinks.map(link => (
            <ExternalLinkButton key={link.url} url={link.url} label={link.label} />
          ))}
        </div>
        <div className="w-2/3 flex flex-col p-4"> {/* Right part for Leaderboard and Google Maps */}
          <Leaderboard data={mockLeaderboardData} />
          <div
            id="google-maps-container"
            className="aspect-w-2 h-40 aspect-h-3 bg-gray-200 mt-4 rounded-lg cursor-pointer"
            onClick={() => console.log("Clicked onto map with Winning Submissions!")}
          >
            {/* Placeholder for Map with Winning Submissions */}
            <p className="text-center text-gray-500 pt-20">Google Maps</p>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default GameSummary;