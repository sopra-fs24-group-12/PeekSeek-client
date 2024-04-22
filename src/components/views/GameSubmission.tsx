import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { getWebsocketDomain } from "helpers/getDomain";
import { notification } from "antd";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import SubmitButton from "../ui/SubmitButton";
import Timer from "../ui/Timer";


interface CardData {
  id: number;
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  link: string;
  noSubmission: boolean;
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

  const animalNames = ["Koala", "Bear", "Giraffe", "Zebra", "Gazelle", "Elephant"];
  const shuffledAnimalNames = [...animalNames].sort(() => Math.random() - 0.5);

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
            navigate(`/voting/${gameId}/`);
          } else if (messageParsed.status === "left") {
            openNotification(messageParsed.username + " left");
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
    //localStorage.setItem("token", "aeeafad9-60c5-4662-8ea7-6909a7d8b9e5");
    //localStorage.setItem("username", "a");

    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        const response = await api.get("/games/" + gameId + "/submissions", { headers });
        console.log("API Response 1:", response.data);

        const response1 = await api.get("/games/" + gameId + "/round", { headers });
        console.log("API Response 2:", response1.data);

        const transformedData: CardData[] = response.data.map((item: any, index: number) => ({
          id: item.id,
          cityName: !item.noSubmission ? response1.data.gameLocation : "",
          quest: !item.noSubmission ? response1.data.quest : "",
          anonymousName: !item.noSubmission ? `Anonymous ${shuffledAnimalNames[index]}` : "NOTHING FOUND",
          imageUrl: !item.noSubmission ? generateStreetViewImageLink(item.submittedLocation.lat, item.submittedLocation.lng, item.submittedLocation.heading, item.submittedLocation.pitch) : "", // Use item.image if available, otherwise empty string
          noSubmission: item.noSubmission,
          //link: "https://example.com/link1"
        }));

        transformedData.sort((a, b) => {
          if (a.noSubmission && !b.noSubmission) {
            return 1;
          } else if (!a.noSubmission && b.noSubmission) {
            return -1;
          } else {
            return 0;
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

  // const cardsData = [
  //   {
  //     id: 1,
  //     cityName: "Rome",
  //     quest: "Locate the best sunrise spot",
  //     anonymousName: "Anonymous Koala",
  //     imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
  //     link: "https://example.com/link1",
  //     noSubmission: true,
  //   },
  //   {
  //     id: 2,
  //     cityName: "Rome",
  //     quest: "Locate the best sunrise spot",
  //     anonymousName: "Anonymous Bear",
  //     imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
  //     link: "https://example.com/link1",
  //     noSubmission: false,
  //   },
  //   {
  //     id: 3,
  //     cityName: "Rome",
  //     quest: "Locate the best sunrise spot",
  //     anonymousName: "Anonymous Giraffe",
  //     imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
  //     link: "https://example.com/link1",
  //     noSubmission: false,
  //   },
  //   {
  //     id: 4,
  //     cityName: "Rome",
  //     quest: "Locate the best sunrise spot",
  //     anonymousName: "Anonymous Zebra",
  //     imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
  //     link: "https://example.com/link1",
  //     noSubmission: false,
  //   },
  //   {
  //     id: 5,
  //     cityName: "Rome",
  //     quest: "Locate the best sunrise spot",
  //     anonymousName: "Anonymous Gazelle",
  //     imageUrl: generateStreetViewImageLink("11", "11", "11", "11"),
  //     link: "https://example.com/link1",
  //     noSubmission: false,
  //   },
  //   {
  //     id: 6,
  //     cityName: "Rome",
  //     quest: "Locate the best sunrise spot",
  //     anonymousName: "Anonymous Elephant",
  //     imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
  //     link: "https://example.com/link1",
  //     noSubmission: false,
  //   },
  // ];


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


  return (
    <BaseContainer
      size="large"
      className="flex flex-col items-center"
    >
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
            <SubmitButton voteData={mergeDataForSubmission()} gameId={gameId} />
          </div>
        </div>

        {/* Chat Component */}
        <div className="md:w-1/4 w-full p-4 lg:order-none flex justify-center items-center mt-[-120px]">
          <Timer initialTimeInSeconds={10} timeInSeconds={remainingSeconds} title={"RESULTS IN:"} />
        </div>
      </div>
    </BaseContainer>
  );
};

export default GameSubmission;
