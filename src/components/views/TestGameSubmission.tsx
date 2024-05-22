import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { getWebsocketDomain } from "helpers/getDomain";
import { notification } from "antd";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Input, Button, useDisclosure, Progress, CircularProgress, Chip } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import SubmitButton from "../ui/SubmitButton";
import StreetViewModal from "../ui/StreetViewModal";
import ErrorMessageModal from "components/ui/ErrorMessageModal";
import { MagnifyingGlass, TailSpin } from "react-loader-spinner";


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

const TestGameSubmission = () => {
  const { gameId, setGameId } = useParams();
  const [pickedCardId, setPickedCardId] = useState<number | null>(null);
  const [banned, setBanned] = useState(new ExtendedDictionary());
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [submissionDone, setSubmissionDone] = useState((localStorage.getItem("submissionDone") !== "false"));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pageLoading, setPageLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(0);
  let timerId;
  const [gameEndModalOpen, setGameEndModalOpen] = useState(false);
  const [gameEndMessage, setGameEndMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryId, setSummaryId] = useState(null);
  let client = new Client();
  const [currentQuest, setCurrentQuest] = useState(1);
  const [totalQuests, setTotalQuests] = useState(1);

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
    }, 2000
    )
  }, []);

  function startInactivityTimer() {
    timerId = setInterval(() => {
      // Simulating the inactivity timer
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
    const dummySubmissions: CardData[] = [
      { id: 1, cityName: "City 1", quest: "Quest 1", anonymousName: "Anonymous Koala", lat: "40.748817", lng: "-73.985428", heading: "0", pitch: "0", imageUrl: "", link: "", noSubmission: false, ownSubmission: false },
      { id: 2, cityName: "City 2", quest: "Quest 2", anonymousName: "Anonymous Bear", lat: "34.052235", lng: "-118.243683", heading: "0", pitch: "0", imageUrl: "", link: "", noSubmission: false, ownSubmission: false },
      { id: 3, cityName: "City 3", quest: "Quest 3", anonymousName: "Anonymous Giraffe", lat: "51.507351", lng: "-0.127758", heading: "0", pitch: "0", imageUrl: "", link: "", noSubmission: false, ownSubmission: false },
      { id: 4, cityName: "City 4", quest: "Quest 4", anonymousName: "Anonymous Zebra", lat: "48.856613", lng: "2.352222", heading: "0", pitch: "0", imageUrl: "", link: "", noSubmission: false, ownSubmission: false },
      { id: 4, cityName: "City 4", quest: "Quest 4", anonymousName: "Anonymous Zebra", lat: "48.856613", lng: "2.352222", heading: "0", pitch: "0", imageUrl: "", link: "", noSubmission: false, ownSubmission: false },


    ];
    setCardsData(dummySubmissions);
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
  };

  const handleUnpickClick = (index) => {
    setPickedCardId(null);
  };

  const handleBanClick = (index) => {
    if (pickedCardId === index) {
      setPickedCardId(null);
    }
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    updatedBanned.set(index, "ban");
    setBanned(updatedBanned);
  };

  const handleUnbanClick = (index) => {
    const updatedBanned = new ExtendedDictionary();
    updatedBanned.data = { ...banned.data };
    updatedBanned.delete(index);
    setBanned(updatedBanned);
  };

  const calculateProgressValue = () => {
    return (remainingTime / roundDurationSeconds) * 100;
  };

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center overflow-auto">
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
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
          size="voting"
          className="flex flex-col items-center min-h-screen w-full overflow-auto"
        >
          <Progress
            aria-label="Progress"
            disableAnimation
            maxValue={totalQuests}
            value={currentQuest}
            color="success"
            className="absolute right-0 top-0 w-full"
          />
          <div className="order-first h-1/8 text-center p-4">
            <h1 className="text-3xl font-bold text-gray-700">Choose your Favourite Pick</h1>
          </div>
          <div className="flex flex-grow items-center justify-center w-full p-4 mt-16">
            <div
              className={`grid ${
                cardsData.length === 1
                  ? "grid-cols-1"
                  : cardsData.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : cardsData.length === 3
                      ? "grid-cols-1 md:grid-cols-3"
                      : cardsData.length === 4
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        : "lg:grid-cols-5"
              } gap-6 justify-center`}
              style={{ maxWidth:
                  cardsData.length === 2
                    ? "50%"
                    : cardsData.length === 3
                      ? "68%"
                      : cardsData.length === 4
                        ? "90%"
                        : "100%" }}
            >
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
                />
              ))}
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
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row md:justify-between gap-1.5 items-center p-4">
            <div className="w-1/4 md:mb-0"></div> {/* Left empty space */}
            <div className="w-1/2 md:w-full flex justify-center md:mb-2">
              <div className="flex items-center lg:absolute lg:bottom-16 xl:absolute xl:bottom-16 2xl:absolute 2xl:bottom-16 justify-center">
                <SubmitButton voteData={mergeDataForSubmission()} gameId={gameId} setSubmissionDone={setSubmissionDone} />
              </div>
            </div>
            <div className="w-full md:w-1/4 flex justify-center md:justify-end items-center">
              <div className="flex items-center lg:absolute lg:bottom-7 lg:right-7 xl:absolute xl:bottom-7 xl:right-7 2xl:absolute 2xl:bottom-7 2xl:right-7 flex-1 flex-col justify-center">
                <Chip
                  classNames={{
                    base: "border-1 customStroke",
                    content: "text-xs text-customStroke font-semibold"
                  }}
                  variant="bordered"
                >
                  RESULTS IN:
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
          <Button
            onPress={onOpen}
            className="md:mt-2 md:mb-2 lg:absolute bottom-2 right-2 p-2 sm:rounded-full bg-transparent"
            isIconOnly
          >
            <InfoCircleTwoTone style={{ fontSize: "20px" }} />
          </Button>
          <HowToPlayModal isOpen={isOpen} onOpenChange={onOpenChange} context="gamesubmission" />
        </BaseContainer>

      )}
    </div>
  );
};

export default TestGameSubmission;
