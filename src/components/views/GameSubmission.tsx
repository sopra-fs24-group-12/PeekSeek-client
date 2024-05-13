import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { getWebsocketDomain } from "helpers/getDomain";
import { notification } from "antd";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Input, Button, useDisclosure, Progress } from "@nextui-org/react";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import SubmitButton from "../ui/SubmitButton";
import StreetViewModal from "../ui/StreetViewModal"; //TODO: Get this working
import Timer from "../ui/Timer";
import { ThreeDots } from "react-loader-spinner";
import { set } from "lodash";

const google = window.google;


interface CardData {
  id: number;
  cityName: string;
  quest: string;
  anonymousName: string;
  lat: string;
  lng: string;
  heading: string;
  pitch: string;
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
  const [notificationApi, contextHolder] = notification.useNotification();
  const [submissionDone, setSubmissionDone] = useState((localStorage.getItem("submissionDone") !== "false"));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showImages, setShowImages] = useState(false);
  let loadedImages = 0;
  const [currQuestNr, setQuestNr] = useState(parseInt(localStorage.getItem("currentQuest")));

  const mergeDataForSubmission = (): ExtendedDictionary => {
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    if (pickedCardId) {
      updatedBanned.set(pickedCardId, "winner");
    }

    return updatedBanned;
  };

  const openNotification = (message: string) => {
    notificationApi.open({
      message: message,
      duration: 2,
    });
  };

  useEffect(() => {
    const sendRequest = async () => {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        await api.put(`/games/${gameId}/active`, null, { headers });
      } catch (error) {
        alert(
          `You were kicked due to inactivity. \n${handleError(error)}`,
        );
        localStorage.clear();
        //setModalOpen(false);
        navigate("/landing");
      }
    };

    sendRequest();

    const intervalId = setInterval(() => {
      sendRequest();
    }, 1000);

    return () => {
      clearInterval(intervalId);
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

  // const animalNames = ["Koala", "Bear", "Giraffe", "Zebra", "Gazelle", "Elephant"];
  // const shuffledAnimalNames = [...animalNames].sort(() => Math.random() - 0.5);

  useEffect(() => {
    let client = new Client();
    const websocketUrl = getWebsocketDomain();
    client.configure({
      brokerURL: websocketUrl,
      debug: function(str) {
        console.log(str);
      },
      onConnect: () => {
        const destination = "/topic/games/" + gameId;
        const timerDestination = "/topic/games/" + gameId + "/timer";
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log("Received message:", messageParsed);
          if (messageParsed.status === "summary") {
            localStorage.setItem("submissionDone", "false");
            //setModalOpen(false);
            navigate(`/voting/${gameId}/`);
          } else if (messageParsed.status === "left") {
            openNotification(messageParsed.username + " left");
          } else if (messageParsed.status === "game_over") {
            localStorage.setItem("submissionDone", "false");
            //setModalOpen(false);
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
            lat: item.submittedLocation.lat,
            lng: item.submittedLocation.lng,
            heading: item.submittedLocation.heading,
            pitch: item.submittedLocation.pitch,
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

        console.log(localStorage.getItem("username"))
        console.log("Before filtering:", transformedData);
        const filteredData = transformedData.filter((item) => !item.ownSubmission);
        console.log("After filtering:", filteredData);

        setCardsData(transformedData);
      } catch (error) {
        alert(
          `Something went wrong while fetching submission information: \n${handleError(error)}`,
        );
      }
    }

    fetchData();
  }, []);

  function generateStreetViewSubmissionLink(lat: string, long: string, heading: string, pitch: string): string {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const baseUrl = "https://www.google.com/maps/embed/v1/streetview/";

    const params = new URLSearchParams({
      key: apiKey,
      location: `${lat},${long}`,
      heading: heading,
      pitch: pitch,
    });

    return `${baseUrl}?${params}`;
  }

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 0, lng: 0, heading: 0, pitch: 0 });

  const handleImageClick = (index) => {
    const card = cardsData.find((card) => card.id === index);
    if (card) {
      const newCoords = {
        lat: parseFloat(card.lat),
        lng: parseFloat(card.lng),
        heading: parseFloat(card.heading),
        pitch: parseFloat(card.pitch)
      };
      setSelectedCoords(newCoords);
    }
    setModalOpen(true);
  }

  useEffect(() => {
    if (selectedCoords.lat !== 0 || selectedCoords.lng !== 0){
      setModalOpen(true);
    }
  }, [selectedCoords]);

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

  const imageLoaded = () => {
    loadedImages += 1;
    if (loadedImages === cardsData.length) {
      setTimeout(() => {
        setShowImages(true);
      }, 1000);
    }
  }


  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      {submissionDone ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center">
            <ThreeDots
              visible={true}
              height={80}
              width={80}
              color="white"
              radius={9}
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div className="text-white mt-4">Waiting for participants to vote...</div>
          </div>
        </div>
      ) : (
        <BaseContainer
          size="large"
          className="flex flex-col items-center"
        >
          <Progress
            aria-label="Progress"
            disableAnimation
            maxValue= {parseInt(localStorage.getItem("totalQuests"), 10)}
            value={currQuestNr-1}
            color="success"
            className="absolute right-0 top-0 w-full" />
          {contextHolder}
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
                    lat={card.lat}
                    lng={card.lng}
                    heading={card.heading}
                    pitch={card.pitch}
                    imageUrl={card.imageUrl}
                    onImageClick={() => handleImageClick(card.id)}
                    onPickClick={() => handlePickClick(card.id)}
                    onBanClick={() => handleBanClick(card.id)}
                    onUnpickClick={() => handleUnpickClick(card.id)}
                    onUnbanClick={() => handleUnbanClick(card.id)}
                    isPicked={pickedCardId === card.id}
                    isBanned={banned.hasKey(card.id)}
                    noSubmission={card.noSubmission}
                    ownSubmission={card.ownSubmission}
                    imageLoaded={imageLoaded}
                    showImage={showImages}
                  />
                ))}
              </div>
              <StreetViewModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                generatedLink={generateStreetViewSubmissionLink(
                  selectedCoords.lat.toString(),
                  selectedCoords.lng.toString(),
                  selectedCoords.heading.toString(),
                  selectedCoords.pitch.toString()
                )}
              />
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
//TODO: Close modal
