import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { getWebsocketDomain } from "helpers/getDomain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


//import UI Elements
import BaseContainer from "../ui/BaseContainer";
import WinningCard from "../ui/WinningCard";
import Leaderboard from "../ui/Leaderboard";
import Timer from "../ui/Timer";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { Progress } from "@nextui-org/react";

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
  const [currQuestNr, setQuestNr] = useState(parseInt(localStorage.getItem("currentQuest")));
  const [winningSubmission, setWinningSubmission] = useState({
    id: "1",
    cityName: "",
    quest: "",
    anonymousName: "",
    imageUrl: "",
    noSubmission: false,
  });
  let timerId;

  const openNotification = (message: string) => {
    toast.info(message, {autoClose: 3000});
  };

  useEffect(() => {
    let tempId = startInactivityTimer();

    return () => {
      clearInterval(tempId);
    };
  }, []);

  function startInactivityTimer() {
    const headers = {
      "Authorization": localStorage.getItem("token"),
    };

    timerId = setInterval(async () => {
      try {
        await api.put(`/games/${gameId}/active`, null, { headers });
        console.log("sent active message")
      } catch (error) {
        alert(
          `Something went wrong while sending active ping: \n${handleError(error)}`,
        );
        navigate("/landing");
      }
    }, 2000);

    return timerId;
  }

  function stopInactivityTimer() {
    clearInterval(timerId);
  }

  useEffect(() => {
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
            bonusPoints: user.pointsThisRound,
            streak: user.streak,
          }));

          setFormattedLeaderboard(formattedLeaderboard);
          console.log(formattedLeaderboard);
        } else {
          console.log("Invalid or empty response data");
        }
      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`,
        );
        localStorage.clear();
        navigate("/landing");
      }

      try {
        const response1 = await api.get("/games/" + gameId + "/winningSubmission", { headers });
        console.log("API Response:", response1.data);

        const response2 = await api.get("/games/" + gameId + "/round", { headers });
        console.log("API Response:", response2.data);

        const noSubmission = response1.data.noSubmission;

        setWinningSubmission(
          {
            id: response1.data.id.toString(),
            cityName: !noSubmission ? response2.data.geoCodingData.formAddress : "",
            quest: !noSubmission ? response2.data.quest : "",
            anonymousName: response1.data.username,
            imageUrl: !noSubmission ? generateStreetViewImageLink(response1.data.submittedLocation.lat, response1.data.submittedLocation.lng, response1.data.submittedLocation.heading, response1.data.submittedLocation.pitch) : "",
            noSubmission: noSubmission,
          },
        );

      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`,
        );
        localStorage.clear();
        navigate("/landing");
      }

    }

    fetchData();
  }, []);

  useEffect(() => {
    let client = new Client();
    const websocketUrl = getWebsocketDomain();
    client.configure({
      brokerURL: websocketUrl,
      onConnect: () => {
        const destination = "/topic/games/" + gameId;
        const timerDestination = "/topic/games/" + gameId + "/timer";
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          if (messageParsed.status === "round") {
            stopInactivityTimer();
            navigate(`/game/${gameId}/`);
          } else if (messageParsed.status === "game_over") {
            stopInactivityTimer();
            localStorage.clear();
            navigate(`/gamesummary/${messageParsed.summaryId}/`);
          } else if (messageParsed.status === "left") {
            openNotification(messageParsed.username + " left");
          }
        });
        client && client.subscribe(timerDestination, (message) => {
          let messageParsed = JSON.parse(message.body);
          setTimeRemaining(messageParsed.secondsRemaining);
        });
      },

    });
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, []);

  function generateStreetViewImageLink(lat: string, long: string, heading: string, pitch: string): string {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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
  const currentQuest = parseInt(localStorage.getItem("currentQuest"), 10)
  const totalQuests = parseInt(localStorage.getItem("totalQuests"), 10)
  const questProgress = ( currentQuest/ totalQuests) * 100;

  return (
    <BaseContainer
      size="large" className="flex flex-col items-center justify-center min-h-screen">
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <Progress
        aria-label="Progress"
        disableAnimation
        maxValue= {parseInt(localStorage.getItem("totalQuests"), 10)}
        value={currQuestNr-1}
        color="success"
        className="absolute right-0 top-0 w-full" />
      <div className="flex flex-col items-center justify-center w-full h-full">
        <WinningCard
          key={winningSubmission.id}
          cityName={winningSubmission.cityName}
          quest={winningSubmission.quest}
          anonymousName={winningSubmission.anonymousName}
          imageUrl={winningSubmission.imageUrl}
          noSubmission={winningSubmission.noSubmission}
        />
        <div className="mt-10 w-full relative flex flex-col items-center">
          <div className="max-w-2xl mx-auto"> {/* Leaderboard centered */}
            <Leaderboard data={formattedLeaderboard} />
          </div>
          <div className="absolute right-0 top-0 mr-10"> {/* Position the Timer to the right of Leaderboard */}
            <Timer
              initialTimeInSeconds={initialTime}
              timeInSeconds={timeRemaining}
              title="NEXT ROUND:"
            />
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default VotingResults;
