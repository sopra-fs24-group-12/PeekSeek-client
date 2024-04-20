import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";

//import UI Elements
import BaseContainer from "../ui/BaseContainer";
import WinningCard from "../ui/WinningCard";
import Leaderboard from "../ui/Leaderboard";
import Timer from "../ui/Timer";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";

// Mock winning submission data
const mockWinningSubmission = {
  id: "1",
  cityName: "Rome",
  quest: "Locate the best sunrise spot",
  anonymousName: "Nils",
  imageUrl: "https://example.com/path/to/winning/image.jpg",
};

const mockLeaderboardData = [
  { rank: 1, name: "Nils", basePoints: 100, bonusPoints: 50 },
  { rank: 2, name: "Ece", basePoints: 90, bonusPoints: 45 },
  { rank: 3, name: "Youssef", basePoints: 85, bonusPoints: 40 },
  { rank: 4, name: "Georg", basePoints: 80, bonusPoints: 35 },
  { rank: 4, name: "Silvan", basePoints: 80, bonusPoints: 35 },
  { rank: 4, name: "Böhlen", basePoints: 80, bonusPoints: 35 },
];

// Mock initial time for the timer in seconds
const initialTime = 30;

const VotingResults = () => {
  const { gameId, setGameId } = useParams();
  const [formattedLeaderboard, setFormattedLeaderboard] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const [winningSubmission, setWinningSubmission] = useState({id: "1",
    cityName: "",
    quest: "",
    anonymousName: "",
    imageUrl: "",
    noSubmission: false,
  });

  useEffect(() => {
    localStorage.setItem("token", "eb47db3a-d291-4a93-8dc3-d71d5742031d");
    localStorage.setItem("username", "a");

    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };
      try {
        const response = await api.get("/games/" + gameId + "/leaderboard", { headers });
        if (response && response.data && Array.isArray(response.data)) {
          const sortedLeaderboard = [...response.data];

          sortedLeaderboard.sort((a, b) => b.score - a.score);

          const formattedLeaderboard = sortedLeaderboard.map((user, index) => ({
            rank: index + 1,
            name: user.username,
            basePoints: user.score,
            bonusPoints: user.streak
          }));

          setFormattedLeaderboard(formattedLeaderboard);
          console.log(formattedLeaderboard);
        } else {
          console.log("Invalid or empty response data");
        }
      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`
        );
      }

      try {
        const response1 = await api.get("/games/" + gameId + "/winningSubmission", { headers });
        console.log("API Response:", response1.data);

        const response2 = await api.get("/games/" + gameId + "/round", {headers});
        console.log("API Response:", response2.data);

        const noSubmission = response1.data.noSubmission;

        setWinningSubmission(
          {
            id: response1.data.id.toString(),
            cityName: !noSubmission?response2.data.geoCodingData.formAddress:"",
            quest: !noSubmission?response2.data.quest: "",
            anonymousName: "Anonymous Tiger",
            imageUrl: !noSubmission?generateStreetViewImageLink(response1.data.submittedLocation.lat, response1.data.submittedLocation.lng, response1.data.submittedLocation.heading, response1.data.submittedLocation.pitch):"",
            noSubmission: noSubmission,
          }
        )

      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`
        );
      }

    }
    fetchData();
  }, [])

  useEffect(() => {
    let client = new Client();
    const websocketUrl = 'ws://localhost:8080/ws';
    client.configure({
      brokerURL: websocketUrl,
      debug: function(str) {
        console.log(str);
      },
      onConnect: () => {
        const destination = `/topic/games/` + gameId;
        const timerDestination = `/topic/games/` + gameId + "/timer";
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log('Received message:', messageParsed);
          if (messageParsed.status === "round") {
            navigate(`/game/${gameId}/`);
          }
        });
        client && client.subscribe(timerDestination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log('Received message from topic 2:', messageParsed);
          setTimeRemaining(messageParsed.secondsRemaining);
        });
      },

    })
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, [])

  function generateStreetViewImageLink(lat: string, long: string, heading: string, pitch: string): string {
    const apiKey = "";

    const baseUrl = "https://maps.googleapis.com/maps/api/streetview";

    const params = new URLSearchParams({
      size: "600x400",
      location: `${lat},${long}`,
      heading: heading,
      pitch: pitch,
      key: apiKey,
    });

    return `${baseUrl}?${params}`;
  }

  return ( 
    <BaseContainer
      size="large">
      <div className="flex flex-col items-center justify-center w-full">
        <WinningCard
          key={winningSubmission.id}
          cityName={winningSubmission.cityName}
          quest={winningSubmission.quest}
          anonymousName={winningSubmission.anonymousName}
          imageUrl={winningSubmission.imageUrl}
          noSubmission={winningSubmission.noSubmission}
        />
        <div className="mt-10 w-full relative">
          <div className="max-w-2xl mx-auto"> {/* Leaderboard centered */}
            <Leaderboard data={formattedLeaderboard} />
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
    </BaseContainer>
  );
};

export default VotingResults;
