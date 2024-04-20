import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import Chat from "../ui/Chat";
import SubmitButton from "../ui/SubmitButton";
import Timer from "../ui/Timer";
import game from "./Game";


interface CardData {
  id: number;
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  link: string;
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
  // const [cardsData, setCardsData] = useState<CardData[]>([]);


  const mergeDataForSubmission = (): ExtendedDictionary => {
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    if (pickedCardId) {
      updatedBanned.set(pickedCardId, "winning");
    }
    return updatedBanned;
  };

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
          if (messageParsed.status === "summary") {
            navigate(`/voting/${gameId}/`);
          }
        });
        client && client.subscribe(timerDestination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log('Received message from topic 2:', messageParsed);
          setRemainingSeconds(messageParsed.secondsRemaining);
        });
      },

    })
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, [])

  // useEffect(() => {
  //   //only for dev purposes
  //   localStorage.setItem("token", "e4406427-b4e0-426c-870b-1a44d6b474ca");
  //   localStorage.setItem("username", "a");
  //
  //   async function fetchData() {
  //     const headers = {
  //       "Authorization": localStorage.getItem("token"),
  //     };
  //
  //     try {
  //       const response = await api.get("/games/" + gameId + "/submissions", { headers });
  //       console.log("API Response 1:", response.data);
  //
  //       const response1 = await api.get("/games/" + gameId + "/round", { headers });
  //       console.log("API Response 2:", response1.data);
  //
  //       const transformedData: CardData[] = response.data.map((item: any) => ({
  //         id: item.id,
  //         cityName: response1.data.gameLocation,
  //         quest: response1.data.quest,
  //         anonymousName: `Anonymous ${item.id}`,
  //         imageUrl: !item.noSubmission ? generateStreetViewImageLink(item.submittedLocation.lat, item.submittedLocation.lng, item.submittedLocation.heading, item.submittedLocation.pitch) : "", // Use item.image if available, otherwise empty string
  //         //link: "https://example.com/link1"
  //       }));
  //
  //       setCardsData(transformedData);
  //     } catch (error) {
  //       alert(
  //           `Something went wrong while fetching submission information: \n${handleError(error)}`
  //       );
  //     }
  //   }
  //
  //   fetchData();
  // }, [])

  const cardsData = [
    {
      id: 1,
      cityName: "Rome",
      quest: "Locate the best sunrise spot",
      anonymousName: "Anonymous Koala",
      imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
      link: "https://example.com/link1",
    },
    {
      id: 2,
      cityName: "Rome",
      quest: "Locate the best sunrise spot",
      anonymousName: "Anonymous Bear",
      imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
      link: "https://example.com/link1",
    },
    {
      id: 3,
      cityName: "Rome",
      quest: "Locate the best sunrise spot",
      anonymousName: "Anonymous Giraffe",
      imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
      link: "https://example.com/link1",
    },
    {
      id: 4,
      cityName: "Rome",
      quest: "Locate the best sunrise spot",
      anonymousName: "Anonymous Zebra",
      imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
      link: "https://example.com/link1",
    },
    {
      id: 5,
      cityName: "Rome",
      quest: "Locate the best sunrise spot",
      anonymousName: "Anonymous Gazelle",
      imageUrl: generateStreetViewImageLink("11", "11", "11", "11"),
      link: "https://example.com/link1",
    },
    {
      id: 6,
      cityName: "Rome",
      quest: "Locate the best sunrise spot",
      anonymousName: "Anonymous Elephant",
      imageUrl: generateStreetViewImageLink("10", "10", "10", "10"),
      link: "https://example.com/link1",
    },
  ];


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
              />
            ))}
          </div>

          <div className="w-full flex justify-center p-4">
            <SubmitButton voteData={mergeDataForSubmission()} gameId={gameId} />
          </div>
        </div>

        {/* Chat Component */}
        <div className="md:w-1/4 w-full p-4 lg:order-none flex justify-center items-center mt-[-120px]">
          <Timer initialTimeInSeconds={10} timeInSeconds={remainingSeconds} title={"ROUND SUMMARY IN:"} />
        </div>
      </div>
    </BaseContainer>
  );
};

export default GameSubmission;
