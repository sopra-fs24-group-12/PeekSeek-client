import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import StartButton from "../ui/StartButton";
import PlayerTable from "../ui/PlayerTable";
import { Button, Input, useDisclosure } from "@nextui-org/react";

import ScrollableContentWrapper from "components/ui/ScrollableContentWrapper";

import CityInputWrapper from "components/ui/CityInputWrapper";
import TimeSlider from "../ui/TimeSlider";
import { getWebsocketDomain } from "helpers/getDomain";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import BackIcon from "../ui/BackIcon";
import UpdateSettingsIcon from "../ui/UpdateSettingsIcon";
import BackDashboardButton from "../ui/BackDashboardButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessageModal from "components/ui/ErrorMessageModal";
import { notification } from "antd";

const Lobby = () => {
  const [quests, setQuests] = React.useState(["", "", "", ""]);
  const [players, setPlayers] = useState([]);
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(120); // Default to 2mins
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [cityName, setCityName] = useState("");
  const [settingsConfirmed, setSettingsConfirmed] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false); // New state to track unsaved changes
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let timerId;
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyQ, setEmptyQ] = useState(true);
  const [questNotificationShown, setQuestNotificationShown] = useState(false);
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
    toast.info(message, { autoClose: 3000 });
  };

  const addPlayer = (newPlayer: String) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  const removePlayer = (usernameToRemove) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player !== usernameToRemove));
  };

  useEffect(() => {
    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        const response = await api.get(`/lobbies/${lobbyId}`, { headers });

        setLobbyName(response.data.name);
        setPlayers(response.data.participants);
        if (response.data.quests === null || response.data.quests.length === 0) {
          setQuests(["", "", "", ""]);
          setEmptyQ(true);
        } else {
          setQuests([...response.data.quests, ""]);
          setEmptyQ(false);
        }
        setRoundDurationSeconds(response.data.roundDurationSeconds - 2 || 120);
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
        setUnsavedChanges(false); // Reset unsaved changes after fetching data
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        stopInactivityTimer();
        client && client.deactivate();
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
      }
    }

    fetchData();
  }, [lobbyId]); // Re-fetch data when lobbyId changes

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
        //console.log("sent active message");
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        stopInactivityTimer();
        client && client.deactivate();
        setErrorMessage("You were kicked due to inactivity! Check for a stable internet connection");
        setErrorModalOpen(true);
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
      debug: function (str) {
        //console.log(str);
      },
      onConnect: () => {
        const destination = "/topic/lobby/" + lobbyId;
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          //console.log("Received message:", messageParsed);

          if (messageParsed.status === "joined") {
            setPlayers(messageParsed.usernames)
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
              setEmptyQ(true);
            } else {
              setQuests([...messageParsed.quests, ""]);
              setEmptyQ(false);
            }
            setRoundDurationSeconds(messageParsed.roundDurationSeconds - 2);
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
  }, [lobbyId]); // Reconnect websocket when lobbyId changes

  const handleQuestChange = (index, value) => {
    const newValue = value.slice(0, 20);
    const updatedQuests = [...quests];
    updatedQuests[index] = newValue;

    if (index === updatedQuests.length - 1 && value.trim() !== "") {
      updatedQuests.push("");
    }

    setQuests(updatedQuests);
    setUnsavedChanges(true); // Mark unsaved changes when quest changes

    if (value.trim().length === 20 && !questNotificationShown) {
      notification.warning({
        message: "Quest can be maximum 20 characters long!",
        duration: 2,
        key: "quest-limit"
      });
      setQuestNotificationShown(true);
    } else if (value.trim().length < 20 && questNotificationShown) {
      setQuestNotificationShown(false);
    }
  };

  const deleteQuest = (index) => {
    const updatedQuests = [...quests];
    updatedQuests.splice(index, 1);
    // Ensure there is always at least one input field
    if (updatedQuests.length === 0) {
      updatedQuests.push("");
    }
    setQuests(updatedQuests);
    setUnsavedChanges(true); // Mark unsaved changes when quest changes
  };

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
        setUnsavedChanges(false); // Reset unsaved changes after saving
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        stopInactivityTimer();
        client && client.deactivate();
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
      }
    }

    return (
      <Button
        disabled={!admin}
        radius="full"
        size="lg"
        style={{
          fontFamily: "'Lato'",
          fontWeight: 400
        }}
        color={unsavedChanges ? "warning" : "default"}
        startContent={<UpdateSettingsIcon size={40}/>}
        className={`items-center mr-4 shadow-lg ${unsavedChanges ? "bg-gradient-to-tr from-yellow-500 to-yellow-400 text-black pulsate" : "bg-gradient-to-tr from-gray-400 to-gray-300 text-black"}`}
        onClick={() => {
          save();
        }}
      >
        Update
        <style>{`
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                }
            }

            .pulsate {
                animation: pulse 1s infinite;
            }
        `}</style>
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
        stopInactivityTimer();
        client && client.deactivate();
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
      }
    }

    return (
      <Button
        radius="full"
        size="lg"
        color="default"
        style={{
          fontFamily: "'Lato'",
          fontWeight: 400
        }}
        className="items-center bg-gradient-to-tr from-gray-400 to-gray-300 text-black shadow-lg"
        startContent={<BackIcon />}
        onClick={() => {
          leave();
        }}
      >
        Leave
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            width: "120%",
            maxWidth: "480px",
            maxHeight: "480px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            border: "5px solid white",
            marginTop: "15px",
            marginBottom: "15px",
            aspectRatio: "1",
          }}
        >
          <img src={imageUrl} alt="Google Map" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    );
  };

  function handleErrorInLobby() {
    setErrorModalOpen(false);
    localStorage.clear();
    navigate("/landing");
  }

  return (
    <>
      {errorModalOpen && <ErrorMessageModal isOpen={errorModalOpen} onClose={() => handleErrorInLobby()} errorMessage={errorMessage} />}
      <BaseContainer size="large" className="flex flex-col items-center overflow-hidden min-h-screen max-w-full">
        <ToastContainer
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
        <h1 className="text-3xl font-bold text-gray-700 my-0 text-center">{lobbyName}</h1>
        <div className="flex flex-col md:flex-row w-full justify-between space-y-6 md:space-y-0 md:space-x-6 overflow-auto">
          <div className="md:w-1/3 p-4 gap-4 flex flex-col">
            <TimeSlider
              disabled={!admin}
              selectedDuration={roundDurationSeconds}
              setRoundDurationSeconds={(value) => {
                setRoundDurationSeconds(value);
                setUnsavedChanges(true); // Mark unsaved changes when round duration changes
              }}
            />
            <PlayerTable
              players={players} />
          </div>
          <div className="md:w-1/3 p-4 gap-4">
            <CityInputWrapper>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%" }}>
                <Input
                  disabled={!admin}
                  type="text"
                  label="Your Destination"
                  title="city name"
                  placeholder="Enter city name"
                  value={cityName}
                  onChange={(e) => {
                    setCityName(e.target.value);
                    setUnsavedChanges(true); // Mark unsaved changes when city name changes
                  }}
                  style={admin ? { width: "300px" } : { width: "300px", cursor: "not-allowed",}}
                />
              </div>
            </CityInputWrapper>
            <GoogleMapStaticImage />
          </div>
          <div className="md:w-1/3 p-4">
            {admin ? (<ScrollableContentWrapper>
              <h6 className="text-center font-bold mt-2 mb-2">Your Quests</h6>
              <p className="text-left text-sm mt-0 mb-4 ml-2 font-semibold">Find a...</p>
              <div style={{ overflowY: "auto", maxHeight: "500px", width: "100%" }}>
                {quests.map((quest, index) => (
                  <Input
                    disabled={!admin}
                    isClearable
                    key={`quest-${index}`} // Unique key for each input
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
                {emptyQ ? (
          
                  <p className="text-center text-sm mt-2 mb-2" style={{ color: "#888888" }}>Currently the admin did not setup quests</p>
                ) : ( <> {quests.filter(item => item !== "").map((quest, index) => (
                  <Input
                    disabled
                    key={`quest-${index}`} // Unique key for each input
                    placeholder={`Quest #${index + 1}`}
                    value={quest}
                    className="mb-2"
                    fullWidth
                    style={{
                      boxSizing: "border-box",
                      cursor: "not-allowed",
                    }}
                  />
                ))} </>)}
              </div>
            </ScrollableContentWrapper>}
          </div>
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center p-4">
            <LeaveButton/>
            {!admin ?
              (<p className="text-xl font-bold p-6">Waiting for the admin to configure and start the game...</p>) : (
                <>
                  <StartButton
                    disabled={!settingsConfirmed || players.length < 3}
                    lobbyId={lobbyId}
                    unsavedChanges={unsavedChanges} // Pass unsaved changes state
                  />
                  <SaveButton />
                </>
              )}
          </div>
        </div>
        {/* {!admin && <InteractionDisabledOverlay />} */}
        <Button
          onPress={onOpen}
          className="absolute bottom-0 right-0 sm rounded-full bg-transparent"
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
