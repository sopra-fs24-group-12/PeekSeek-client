import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { getWebsocketDomain } from "helpers/getDomain";
import { notification } from "antd";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Input, Button, useDisclosure, Progress } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import SubmitButton from "../ui/SubmitButton";
import Timer from "../ui/Timer";
import { MagnifyingGlass, TailSpin, ThreeDots } from "react-loader-spinner";

interface CardData {
  id: number;
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  link: string;
  noSubmission: boolean;
  ownSubmission: boolean;
}

class ExtendedDictionary {
  data: { [key: number]: string };

  constructor() {
    this.data = {};
  }

  set(key: number, value: string): void {
    this.data[key] = value;
  }

  get(key: number): string | undefined {
    return this.data[key];
  }

  delete(key: number): void {
    delete this.data[key];
  }

  toJSON(): string {
    return JSON.stringify(this.data);
  }

  hasKey(key: number): boolean {
    return this.data.hasOwnProperty(key);
  }
}

const GameSubmission = () => {
  const { gameId, setGameId } = useParams();
  const [pickedCardId, setPickedCardId] = useState<number | null>(null);
  const [banned, setBanned] = useState(new ExtendedDictionary());
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [submissionDone, setSubmissionDone] = useState((localStorage.getItem("submissionDone") !== "false"));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currQuestNr, setQuestNr] = useState(parseInt(localStorage.getItem("currentQuest")));
  const [pageLoading, setPageLoading] = useState(true);
  let timerId;

  const mergeDataForSubmission = (): ExtendedDictionary => {
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    if (pickedCardId) {
      updatedBanned.set(pickedCardId, "winner");
    }

    return updatedBanned;
  };

  const openNotification = (message: string) => {
    toast.info(message, {autoClose: 3000});
  };

  useEffect(() => {
    let tempId = startInactivityTimer();

    return () => {
      clearInterval(tempId);
    };
  }, []);

  useEffect(() => {
    setInterval(() => {
      setPageLoading(false);
    }, 1500
    )
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
          if (messageParsed.status === "summary") {
            stopInactivityTimer();
            localStorage.setItem("submissionDone", "false");
            navigate(`/voting/${gameId}/`);
          } else if (messageParsed.status === "left") {
            openNotification(messageParsed.username + " left");
          } else if (messageParsed.status === "game_over") {
            stopInactivityTimer();
            localStorage.setItem("submissionDone", "false");
            navigate("/gamesummary/" + messageParsed.summaryId);
          }
        });
        client && client.subscribe(timerDestination, (message) => {
          let messageParsed = JSON.parse(message.body);
          setRemainingSeconds(messageParsed.secondsRemaining);
        });
      },

    });
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, []);

  useEffect(() => {

    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        const response = await api.get("/games/" + gameId + "/submissions", { headers });
        const animalNames = ["Koala", "Bear", "Giraffe", "Zebra", "Gazelle", "Elephant"];
        console.log("API Response 1:", response.data);

        const response1 = await api.get("/games/" + gameId + "/round", { headers });
        console.log("API Response 2:", response1.data);

        const transformedData: CardData[] = [];
        response.data.forEach((item: any, index: number) => {
          const transformedItem: CardData = {
            id: item.id,
            cityName: response1.data.geoCodingData.location,
            quest: response1.data.quest,
            anonymousName: `Anonymous ${animalNames[index]}`,
            imageUrl: !item.noSubmission
              ? generateStreetViewImageLink(
                item.submittedLocation.lat,
                item.submittedLocation.lng,
                item.submittedLocation.heading,
                item.submittedLocation.pitch
              )
              : "",
            noSubmission: item.noSubmission,
            link: "",
            ownSubmission: localStorage.getItem("username") === item.username,
          };
          if (!transformedItem.ownSubmission) {
            transformedData.push(transformedItem);
          }
        });

        setCardsData(transformedData);
      } catch (error) {
        alert(
          `Something went wrong while fetching submission information: \n${handleError(error)}`,
        );
      }
    }

    fetchData();
  }, []);


  const handleImageClick = (url: string) => {
    window.open(url, "_blank");
  };

  const handlePickClick = (index) => {
    if (banned.hasKey(index)) {
      banned.delete(index);
    }
    setPickedCardId(index);
    console.log(banned);
  };

  const handleUnpickClick = (index) => {
    setPickedCardId(null);
    console.log(banned);
  };

  const handleBanClick = (index) => {
    if (pickedCardId === index) {
      setPickedCardId(null);
    }
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    updatedBanned.set(index, "ban");
    setBanned(updatedBanned);
    console.log(banned);

  };

  const handleUnbanClick = (index) => {
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    updatedBanned.delete(index);
    setBanned(updatedBanned);
    console.log(banned);

  };

  const currentQuest = parseInt(localStorage.getItem("currentQuest"), 10)
  const totalQuests = parseInt(localStorage.getItem("totalQuests"), 10)
  const questProgress = ( currentQuest/ totalQuests) * 100;

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      {submissionDone ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center">
            <MagnifyingGlass
              visible={true}
              height={80}
              width={80}
              color="white"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div className="text-white mt-4">Waiting for participants to submit...</div>
          </div>
        </div>
      ) : pageLoading ? (
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
          size="large"
          className="flex flex-col items-center"
        >
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
          <div className="order-first text-center p-4">
            <h1 className="text-3xl font-bold text-gray-700">Choose your Favourite Pick</h1>
          </div>
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* Container for the submission cards */}
            <div className="md:w-3/4 w-full p-4 flex flex-col">
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                {cardsData.map((card, index) => (
                  <SubmissionCard
                    key={card.id}
                    cityName={card.cityName}
                    quest={card.quest}
                    anonymousName={card.anonymousName}
                    imageUrl={card.imageUrl}
                    onImageClick={() => handleImageClick(card.link)}
                    onPickClick={() => handlePickClick(card.id)}
                    onBanClick={() => handleBanClick(card.id)}
                    onUnpickClick={() => handleUnpickClick(card.id)}
                    onUnbanClick={() => handleUnbanClick(card.id)}
                    isPicked={pickedCardId === card.id}
                    isBanned={banned.hasKey(card.id)}
                    noSubmission={card.noSubmission}
                  />
                ))}
              </div>

              <div className="w-full flex justify-center p-4">
                <SubmitButton voteData={mergeDataForSubmission()} gameId={gameId} setSubmissionDone={setSubmissionDone} />
              </div>
            </div>

            {/* Chat Component */}
            <div className="md:w-1/4 w-full p-4 lg:order-none flex justify-center items-center mt-[-120px]">
              <Timer initialTimeInSeconds={10} timeInSeconds={remainingSeconds} title={"RESULTS IN:"} />
            </div>
          </div>
          <Button
            onPress={onOpen}
            className="absolute bottom-2 right-2 p-2 sm rounded-full bg-transparent"
            isIconOnly
          >
            <InfoCircleTwoTone style={{ fontSize: "20px"}}/>
          </Button>
          <HowToPlayModal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            context="gamesubmission"  />
        </BaseContainer>
      )}
    </div>
  );
};

export default GameSubmission;
