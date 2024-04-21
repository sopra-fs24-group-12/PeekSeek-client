import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import Leaderboard from "../ui/Leaderboard";
import ExternalLinkButton from "../ui/ExternalLinkButton";
import BackDashboardButton from "../ui/BackDashboardButton";
import { useParams } from "react-router-dom";


const mockLeaderboardData = [
  { rank: 1, name: "Nils", basePoints: 100, bonusPoints: 50 },
  { rank: 2, name: "Ece", basePoints: 90, bonusPoints: 45 },
  { rank: 3, name: "Youssef", basePoints: 85, bonusPoints: 40 },
  { rank: 4, name: "Georg", basePoints: 80, bonusPoints: 35 },
  { rank: 5, name: "Silvan", basePoints: 70, bonusPoints: 5 },
  { rank: 6, name: "Böhlen", basePoints: 60, bonusPoints: 0 },
];

const externalLinks = [
  { url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu", label: "Winning Submission 1" },
  { url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu", label: "Winning Submission 2" },
  { url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu", label: "Winning Submission 3" },
  { url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu", label: "Winning Submission 4" },
  { url: "https://www.google.com/maps/@47.371779,8.5366792,3a,75y,264.91h,90.77t/data=!3m6!1e1!3m4!1spvbPYFSzTaFhKV-uabCaZw!2e0!7i16384!8i8192?entry=ttu", label: "Winning Submission 5" }
];
const GameSummary = () => {
  // Mock data for city and number of quests
  const [city, setCity] = useState("Rome");
  const [nrOfQuests, setNrOfQuests] = useState(5);
  const {summaryId} = useParams();
  const [externalLinks, setExternalLinks] = useState([]);
  const [successfulRounds, setSuccessfulRounds] = useState(0);
  const [staticMap, setStaticMap] = useState("");
  const lats = [];
  const lngs = [];

  async function generateStaticMapUrl(latitudes: string[], longitudes: string[]): Promise<string> {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';

    // Parse latitudes and longitudes to numbers
    const latitudesNumeric = latitudes.map(lat => parseFloat(lat));
    const longitudesNumeric = longitudes.map(lng => parseFloat(lng));

    // Calculate the center and bounds of the markers
    let centerLat, centerLng, zoom;
    if (latitudesNumeric.length === 1 && longitudesNumeric.length === 1) {
      // If only one marker, set zoom level appropriately
      centerLat = latitudesNumeric[0];
      centerLng = longitudesNumeric[0];
      zoom = 12; // Adjust this value as needed for the desired zoom level
    } else {
      // If multiple markers, calculate zoom level based on bounds
      centerLat = (Math.min(...latitudesNumeric) + Math.max(...latitudesNumeric)) / 2;
      centerLng = (Math.min(...longitudesNumeric) + Math.max(...longitudesNumeric)) / 2;
      const maxLat = Math.max(...latitudesNumeric);
      const minLat = Math.min(...latitudesNumeric);
      const maxLng = Math.max(...longitudesNumeric);
      const minLng = Math.min(...longitudesNumeric);
      zoom = calculateZoom(maxLat, minLat, maxLng, minLng);
    }

    // Construct the markers string
    const markers = latitudesNumeric.map((lat, index) => `markers=color:red%7Clabel:${index + 1}%7C${lat},${longitudesNumeric[index]}`).join('&');

    // Construct and return the static map URL
    return `${baseUrl}?size=600x400&${markers}&zoom=${zoom}&center=${centerLat},${centerLng}&key=${apiKey}`;
  }

  function calculateZoom(maxLat: number, minLat: number, maxLng: number, minLng: number): number {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;

    const latFraction = (Math.PI * (maxLat - minLat)) / 180;
    const lngFraction = (Math.PI * (maxLng - minLng)) / 180;

    const latZoom = Math.log(WORLD_DIM.height / latFraction) / Math.LN2;
    const lngZoom = Math.log(WORLD_DIM.width / lngFraction) / Math.LN2;

    return Math.min(Math.floor(Math.min(latZoom, lngZoom)), ZOOM_MAX);
  }

  useEffect(() => {
    //localStorage.setItem("token", "eb47db3a-d291-4a93-8dc3-d71d5742031d");
    //localStorage.setItem("username", "a");

    async function fetchData() {
      try {
        const response = await api.get("/summaries/" + summaryId);

        const linkList = response.data.quests.map((quest, index) => {
          return { url: quest.link, label: index+1 + ": " + quest.description + " found by " + quest.name};
        });

        console.log(linkList)

        console.log("response: ", response)

        setExternalLinks(linkList);
        setSuccessfulRounds(linkList.length);
        setCity(response.data.cityName);
        setNrOfQuests(response.data.roundsPlayed);

        response.data.quests.forEach(quest => {
          lats.push(quest.lat);
          lngs.push(quest.lng);
        });

        setStaticMap(await generateStaticMapUrl(lats, lngs))

      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`
        );
      }
    }
    fetchData();
  }, [])

  return (
    <BaseContainer size="large" className="flex flex-col items-center">
      <div className="p-4 flex w-full items-center">
        <div className="w-1/6">
          <BackDashboardButton />
        </div>
        <div className="w-2/3 text-center">
          <h1 className="text-3xl font-bold text-gray-700">You&apos;ve just explored {city} in {nrOfQuests} round(s) of which {successfulRounds} had a winning submission!</h1>
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
        <div className='w-2/3 flex flex-col p-4'> {/* Right part for Leaderboard and Google Maps */}
          {/*<Leaderboard data={mockLeaderboardData} />*/}

          <img src={staticMap} alt="NO MAP IMAGE AVAILABLE" style={{ borderRadius: '10px 20px 30px 40px' }} />
        </div>
      </div>
    </BaseContainer>
  );
}

export default GameSummary;