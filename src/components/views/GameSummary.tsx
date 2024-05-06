import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import Leaderboard from "../ui/Leaderboard";
import ExternalLinkButton from "../ui/ExternalLinkButton";
import BackDashboardButton from "../ui/BackDashboardButton";
import { useParams } from "react-router-dom";
import StartButton from "../ui/StartButton";


const GameSummary = () => {
  // Mock data for city and number of quests
  const [city, setCity] = useState("Rome");
  const [nrOfQuests, setNrOfQuests] = useState(5);
  const { summaryId } = useParams();
  const [externalLinks, setExternalLinks] = useState([]);
  const [successfulRounds, setSuccessfulRounds] = useState(0);
  const [staticMap, setStaticMap] = useState("");
  const lats = [];
  const lngs = [];


  async function generateStaticMapUrl(latitudes: string[], longitudes: string[]): Promise<string> {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";

    const markers = latitudes.map((lat, index) => `markers=color:red%7Clabel:${index + 1}%7C${lat},${longitudes[index]}`).join("&");

    return `${baseUrl}?size=600x400&${markers}&key=${apiKey}`;
  }

  useEffect(() => {
    //localStorage.setItem("token", "eb47db3a-d291-4a93-8dc3-d71d5742031d");
    //localStorage.setItem("username", "a");

    async function fetchData() {
      try {
        const response = await api.get("/summaries/" + summaryId);

        const linkList = response.data.quests.map((quest, index) => {
          return { url: quest.link, label: index + 1 + ": " + quest.description + " found by " + quest.name };
        });

        console.log(linkList);

        console.log("response: ", response);

        setExternalLinks(linkList);
        setSuccessfulRounds(linkList.length);
        setCity(response.data.cityName);
        setNrOfQuests(response.data.roundsPlayed);

        response.data.quests.forEach(quest => {
          lats.push(quest.lat);
          lngs.push(quest.lng);
        });

        setStaticMap(await generateStaticMapUrl(lats, lngs));

      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`,
        );
      }
    }

    fetchData();
  }, []);

  return (
    <BaseContainer size="large" className="flex flex-col items-center">
      <div className="p-4 flex w-full items-center">
        <div className="w-1/6">
        </div>
        <div className="w-2/3 text-center">
          <h1 className="text-3xl font-bold text-gray-700">You&apos;ve just explored {city} in {nrOfQuests} round(s) of
            which {successfulRounds} had a winning submission!</h1>
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
          {/*<Leaderboard data={mockLeaderboardData} />*/}

          <img src={staticMap} alt="NO MAP IMAGE AVAILABLE" style={{ borderRadius: "10px 20px 30px 40px" }} />
        </div>
      </div>
      <div className="w-full flex justify-between px-4 bottom-8 mb-4 mt-auto" style={{ bottom: "16px" }}>
        <BackDashboardButton/>
      </div>
    </BaseContainer>
  );
};

export default GameSummary;