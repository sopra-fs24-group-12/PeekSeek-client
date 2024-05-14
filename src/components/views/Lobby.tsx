import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import StartButton from "../ui/StartButton";
import PlayerTable from "../ui/PlayerTable";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import ContentWrapper from "components/ui/ContentWrapper";
import ScrollableContentWrapper from "components/ui/ScrollableContentWrapper";
import TimeButtons from "../ui/TimeButtons";
import { getWebsocketDomain } from "helpers/getDomain";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import BackIcon from "../ui/BackIcon";
import UpdateSettingsIcon from "../ui/UpdateSettingsIcon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessageModal from "components/ui/ErrorMessageModal";


const Lobby = () => {
  const [quests, setQuests] = React.useState(["", "", "", ""]);
  const [players, setPlayers] = useState([]);
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(120);   // Default to 2mins
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [cityName, setCityName] = useState("");
  const [settingsConfirmed, setSettingsConfirmed] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let timerId;
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  let client = new Client();

  interface InputQuestsProps {
    disabled: boolean;
  }

  interface CityInputFieldProps {
    disabled: boolean;
  }

  function filterNonEmptyQuests(): string[] {
    return quests.filter((str) => {
      if (typeof str === "string") {
        return str.trim() !== "";
      }

      return false;
    });
  }

  const openNotification = (message: string) => {
    toast.info(message, {autoClose: 3000});
  };

  const addPlayer = (newPlayer: String) => {
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
  };

  const removePlayer = (usernameToRemove) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player !== usernameToRemove));
  };

  useEffect(() => {
    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        const response = await api.get(`/lobbies/${lobbyId}`, { headers });
        console.log("API Response:", response.data);

        setLobbyName(response.data.name);
        setPlayers(response.data.participants);
        if (response.data.quests === null || response.data.quests.length === 0) {
          setQuests(["", "", "", ""]);
        } else {
          setQuests([...response.data.quests, ""]);
        }
        setRoundDurationSeconds(response.data.roundDurationSeconds || 120);
        setCityName(response.data.gameLocation);
        setAdmin(response.data.adminUsername === localStorage.getItem("username"));
        if (response.data.gameLocationCoordinates) {
          setLat(response.data.gameLocationCoordinates.lat);
          setLng(response.data.gameLocationCoordinates.lng);
        } else {
          setLat("0");
          setLng("0");
        }
        setSettingsConfirmed(response.data.quests && response.data.quests.length > 0 && response.data.gameLocation);
        // Set the total number of quests in localStorage
        const filteredQuests = quests.filter(quest => quest.trim() !== "");
        // Set currentQuest to 1
        localStorage.setItem("currentQuest", String(1));
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
        localStorage.clear();
      }
    }

    fetchData();
  }, []);

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
        await api.put(`/lobbies/${lobbyId}/active`, null, { headers });
        console.log("sent active message")
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
        localStorage.clear();
        navigate("/landing");
      }
    }, 2000);

    return timerId;
  }

  function stopInactivityTimer() {
    clearInterval(timerId);
  }

  useEffect(() => {
    const websocketUrl = getWebsocketDomain();
    client.configure({
      brokerURL: websocketUrl,
      debug: function(str) {
        console.log(str);
      },
      onConnect: () => {
        const destination = "/topic/lobby/" + lobbyId;
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log("Received message:", messageParsed);

          if (messageParsed.status === "joined") {
            addPlayer(messageParsed.username);
            openNotification(messageParsed.username + " joined");
          } else if (messageParsed.status === "left") {
            removePlayer(messageParsed.username);
            openNotification(messageParsed.username + " left");
            if (messageParsed.newAdmin) {
              if (messageParsed.newAdmin === localStorage.getItem("username")) {
                setAdmin(true);
                openNotification("You are the new admin!");
              }
            }
          } else if (messageParsed.status === "update") {
            setCityName(messageParsed.gameLocation);
            if (messageParsed.quests === null || messageParsed.quests.length === 0) {
              setQuests(["", "", "", ""]);
            } else {
              setQuests([...messageParsed.quests, ""]);
            }
            setRoundDurationSeconds(messageParsed.roundDurationSeconds);
            if (messageParsed.gameLocationCoordinates !== null) {
              setLat(messageParsed.gameLocationCoordinates.lat);
              setLng(messageParsed.gameLocationCoordinates.lng);
            } else {
              setLat("0");
              setLng("0");
            }
            openNotification("Lobby settings have been updated");
          } else if (messageParsed.status === "started") {
            stopInactivityTimer();
            const gameId = messageParsed.gameId;
            navigate("/game/" + gameId);
          }
        });
      },
    });
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, []);

  const handleQuestChange = (index, value) => {
    const updatedQuests = [...quests];
    updatedQuests[index] = value;

    if (index === updatedQuests.length - 1 && value.trim() !== "") {
      updatedQuests.push("");
    }

    setQuests(updatedQuests);
  };

  const deleteQuest = (index) => {
    const updatedQuests = [...quests];
    updatedQuests.splice(index, 1);
    // Ensure there is always at least one input field
    if (updatedQuests.length === 0) {
      updatedQuests.push("");
    }
    setQuests(updatedQuests);
  };

  localStorage.setItem("totalQuests", String(quests.length-1));
  const total = localStorage.getItem("totalQuests")
  console.log("total quests " + total)

  const SaveButton: React.FC = () => {
    async function save() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };
      const body = JSON.stringify({
        quests: filterNonEmptyQuests(),
        gameLocation: cityName || "Zürich",
        roundDurationSeconds,
      });
      try {
        await api.put("/lobbies/" + lobbyId, body, { headers });
        setSettingsConfirmed(true);
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
      }
    }

    return (
      <Button
        disabled={!admin}
        radius="full"
        size="lg"
        color="default"
        className="shadow-lg"
        onClick={() => {
          console.log("Saving settings");
          save();
        }}
      >
        Save Settings
      </Button>
    );
  };

  const LeaveButton: React.FC = () => {
    const navigate = useNavigate();

    async function leave() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };
      try {
        stopInactivityTimer();
        const response = await api.delete("/lobbies/" + lobbyId + "/leave/", { headers });
        localStorage.clear();
        navigate("/landing");
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
      }
    }

    return (
      <Button
        radius="full"
        size="lg"
        color="default"
        className="shadow-lg"
        onClick={() => {
          console.log("Leaving lobby");
          leave();
        }}
      >
        Leave Lobby
      </Button>
    );
  };

  const GoogleMapStaticImage = () => {
    const latitude = lat || "0";
    const longitude = lng || "0";
    const zoom = 10;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=400x400&maptype=roadmap&key=${apiKey}`;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ height: "25px" }}></div>
        <div style={{ borderRadius: "50%", overflow: "hidden", width: "550px", height: "550px" }}>
          <img src={imageUrl} alt="Google Map" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    );
  };

  function handleErrorInLobby() {
    client && client.deactivate();
    setErrorModalOpen(false);
    localStorage.clear();
    navigate("/landing");
  }

  return (
    <>
      {errorModalOpen && <ErrorMessageModal isOpen={errorModalOpen} onClose={() => handleErrorInLobby()} errorMessage={errorMessage} />}
      <BaseContainer size="large" className="flex flex-col items-center p-2">
        <ToastContainer
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
        <h1 className="text-3xl font-bold text-gray-700 my-4 text-center">{lobbyName}</h1>
        <div className="flex w-full">
          <div className="flex flex-col w-full items-start gap-4 ml-6">
            <TimeButtons
              disabled={!admin}
              selectedDuration={roundDurationSeconds}
              setRoundDurationSeconds={setRoundDurationSeconds}
            />
            <PlayerTable
              players={players} />
          </div>
          <div className="flex-1 items-center justify-center px-16">
            <ContentWrapper>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Input
                  disabled={!admin}
                  type="text"
                  label="Your Destination"
                  title="city name"
                  placeholder="Enter city name"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  style={admin ? { width: "300px" } : { width: "300px", cursor: "not-allowed",}}
                />
              </div>
            </ContentWrapper>
            <GoogleMapStaticImage />
          </div>
          <div className="flex flex-col w-full items-end mr-8">
            {admin ? (<ScrollableContentWrapper>
              <h6 className="font-bold mt-2 mb-2">Your Quests</h6>
              <p className="text-left text-sm mt-0 mb-4 font-semibold">Find a...</p>
              <div style={{ overflowY: "auto", maxHeight: "500px", width: "100%" }}>
                {quests.map((quest, index) => (
                  <Input
                    disabled={!admin}
                    isClearable
                    key={`quest-${index}`}  // Unique key for each input
                    placeholder={`Quest #${index + 1}`}
                    value={quest}
                    onChange={(e) => handleQuestChange(index, e.target.value)}
                    className="mb-2"
                    onClear={() => deleteQuest(index)}
                    fullWidth
                    style={{ boxSizing: "border-box" }}
                  />
                ))}
              </div>
            </ScrollableContentWrapper>): <ScrollableContentWrapper>
              <h6 className="font-bold mt-2 mb-2">Your Quests</h6>
              <p className="text-left text-sm mt-0 mb-4 font-semibold">Find a...</p>
              <div style={{ overflowY: "auto", maxHeight: "500px", width: "100%" }}>
                {quests.filter(item => item !== "").map((quest, index) => (
                  <Input
                    disabled
                    key={`quest-${index}`}  // Unique key for each input
                    placeholder={`Quest #${index + 1}`}
                    value={quest}
                    className="mb-2"
                    fullWidth
                    style={{
                      boxSizing: "border-box",
                      cursor: "not-allowed",
                    }}
                  />
                ))}
              </div>
            </ScrollableContentWrapper>}
          </div>
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center p-4">
            <LeaveButton />
            {!admin ?
              (<p className="text-xl font-bold">Waiting for the admin to configure and start the game...</p>) : (
                <>
                  <StartButton
                    disabled={!settingsConfirmed}
                    lobbyId={lobbyId}
                  />
                  <SaveButton />
                </>
              )}
          </div>
        </div>
        {/* {!admin && <InteractionDisabledOverlay />} */}
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
          context="lobby"  />
      </BaseContainer>
    </>
  );
};

export default Lobby;
