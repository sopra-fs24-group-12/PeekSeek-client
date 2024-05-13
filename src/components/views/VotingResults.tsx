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
import { Chip, CircularProgress, Progress } from "@nextui-org/react";
import { TailSpin, ThreeDots } from "react-loader-spinner";

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
  const [remainingTime, setRemainingTime] = useState(0);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(20);
  const [pageLoading, setPageLoading] = useState(true);
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
    setInterval(() => {
      setPageLoading(false);
    }, 2000
    )
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
          setRemainingTime(messageParsed.secondsRemaining);
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
  const calculateProgressValue = () => {

    return (remainingTime / roundDurationSeconds) * 100;
  };
  const circularProgressStyles = {
    svg: "w-368 h-36 drop-shadow-md",
    indicator: "stroke-white",
    track: "stroke-white/10",
    value: "text-2xl font-semibold text-white",
  };


  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      {pageLoading ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center">
            <TailSpin
              visible={true}
              height={80}
              width={80}
              color="white"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      ) : (
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
              <div className="absolute bottom-0 right-0 mr-5 mb-5 flex flex-col items-center justify-center">
                <Chip
                  classNames={{
                    base: "border-1 customStroke",
                    content: "text-xs text-customStroke font-semibold"
                  }}
                  variant="bordered"
                >
                  NEXT ROUND:
                </Chip>
                <CircularProgress
                  classNames={{
                    svg: "w-36 h-36 drop-shadow-md",
                    indicator: "customStroke",
                    track: "stroke-white/20",
                    value: "text-2xl font-semibold customStroke",
                  }}
                  size="md"
                  value={calculateProgressValue()}
                  valueLabel={`${remainingTime}s`}
                  strokeWidth={3}
                  showValueLabel={true}
                />
              </div>
            </div>
          </div>
        </BaseContainer>
      )
      }
    </div>
  );
};

export default VotingResults;
