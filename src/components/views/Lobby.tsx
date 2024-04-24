import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import StartButton from "../ui/StartButton";
import PlayerTable from "../ui/PlayerTable";
import { Button, Input } from "@nextui-org/react";
import ContentWrapper from "components/ui/ContentWrapper";
import ScrollableContentWrapper from "components/ui/ScrollableContentWrapper";
import TimeButtons from "../ui/TimeButtons";
import { notification } from "antd";
import { getWebsocketDomain } from "helpers/getDomain";

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
  const [notificationApi, contextHolder] = notification.useNotification();

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
    notificationApi.open({
      message: message,
      duration: 2,
    });
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
      } catch (error) {
        alert(
          `Something went wrong while fetching lobby information: \n${handleError(error)}`,
        );
        localStorage.clear();
        navigate("/landing");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const sendRequest = async () => {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        await api.put(`/lobbies/${lobbyId}/active`, null, { headers });
        console.log("sent active message")
      } catch (error) {
        alert(
          `Something went wrong while sending active ping: \n${handleError(error)}`,
        );
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

  useEffect(() => {
    let client = new Client();
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

  const InputQuests: React.FC<InputQuestsProps> = ({ disabled }) => {
    const [localQuests, setLocalQuests] = useState(quests);

    useEffect(() => {
      setLocalQuests([...quests]);
    }, [quests]);

    const handleQuestChange = (index, value) => {
      const updatedQuests = [...localQuests];
      updatedQuests[index] = value;

      if (index === updatedQuests.length - 1 && value.trim() !== "") {
        updatedQuests.push("");
      }

      setLocalQuests(updatedQuests);
    };


    const deleteQuest = (index) => {
      const updatedQuests = [...localQuests];
      updatedQuests.splice(index, 1);
      setLocalQuests(updatedQuests);
    };

    const saveQuestsToGlobal = () => {
      setQuests(localQuests.filter(quest => quest.trim() !== ""));
    };

    return (
      <ScrollableContentWrapper>
        <h6 className="font-bold mt-2 mb-2">Your Quests</h6>
        <p className="text-left text-sm mt-0 mb-4 font-semibold">Find a...</p>
        <div style={{ overflowY: "auto", maxHeight: "500px", width: "100%" }}>
          {localQuests.map((quest, index) => (
            <Input
              isClearable
              key={`quest-${index}`}  // Unique key for each input
              placeholder={`Quest #${index + 1}`}
              value={quest}
              onChange={(e) => handleQuestChange(index, e.target.value)}
              className="mb-2"
              onClear={() => deleteQuest(index)}
              fullWidth
              style={{ boxSizing: "border-box" }}
              disabled={disabled}
            />
          ))}
        </div>
        <Button
          radius="md"
          size="sm"
          style={{ marginTop: "10px" }}
          disabled={disabled}
          onClick={saveQuestsToGlobal}>
          Save Quests
        </Button>
      </ScrollableContentWrapper>
    );
  };

  const CityInputField: React.FC<CityInputFieldProps> = ({ disabled }) => {
    const [localCityName, setLocalCityName] = useState(cityName);

    useEffect(() => {
      setLocalCityName(cityName);
    }, [cityName]);

    const handleCityNameChange = (event) => {
      setLocalCityName(event.target.value);
    };

    const saveCityNameToGlobal = () => {
      setCityName(localCityName);
    };

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Input
          type="text"
          label="Your Destination"
          title="city name"
          placeholder="Enter city name"
          value={localCityName}
          onChange={handleCityNameChange}
          style={{ width: "300px" }}
          disabled={!admin}
        />
        <Button
          radius="md"
          size="sm"
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
          onClick={saveCityNameToGlobal}>Save Destination</Button>
      </div>
    );
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
      } catch (error) {
        alert(
          `Something went wrong while saving lobby settings: \n${handleError(error)}`,
        );
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
        const response = await api.delete("/lobbies/" + lobbyId + "/leave/", { headers });
        localStorage.clear();
        navigate("/landing");
      } catch (error) {
        alert(
          `Something went wrong when leaving the lobby: \n${handleError(error)}`,
        );
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
        <div style={{ borderRadius: "50%", overflow: "hidden", width: "500px", height: "500px", boxShadow: "0 4px 8px rgba(0,0,0,0.3)", border: "5px solid white", marginBottom: "130px" }}>
          <img src={imageUrl} alt="Google Map" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    );
  };

  const InteractionDisabledOverlay = () => (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <p className="text-white text-xl">Waiting for the admin to configure and start the game...</p>
    </div>
  );

  return (
    <BaseContainer size="large" className="flex flex-col items-center p-4">
      {contextHolder}
      <h1 className="text-3xl font-bold text-gray-700 my-4 text-center">{lobbyName}</h1>
      <div className="flex w-full">
        <div className="flex flex-col w-full items-start gap-4 ml-6">
          <TimeButtons
            selectedDuration={roundDurationSeconds}
            setRoundDurationSeconds={setRoundDurationSeconds}
            disabled={!admin} />
          <PlayerTable
            players={players} />
        </div>
        <div className="flex-1 items-center justify-center px-16">
          <ContentWrapper>
            <CityInputField
              disabled={!admin} />
          </ContentWrapper>
          <GoogleMapStaticImage />
        </div>
        <div className="flex flex-col w-full items-end mr-8">
          <InputQuests
            disabled={!admin} />
        </div>
        <div className="w-full flex justify-between px-12 absolute bottom-8" style={{ position: 'absolute', bottom: '16px' }}>
          <LeaveButton />
          <StartButton
            disabled={!settingsConfirmed}
            lobbyId={lobbyId}
          />
          <SaveButton />
        </div>
      </div>
      {!admin && <InteractionDisabledOverlay />}
    </BaseContainer>
  );
};

export default Lobby;
