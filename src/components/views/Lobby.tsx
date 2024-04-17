import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { Client } from '@stomp/stompjs';
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import StartButton from "../ui/StartButton";
import PlayerTable from "../ui/PlayerTable";
import { Autocomplete, AutocompleteItem, Button, Input } from "@nextui-org/react";
import ContentWrapper from "components/ui/ContentWrapper";
import { useAsyncList } from "react-stately";
import { SearchIcon } from "components/ui/SearchIcon";


const Lobby = () => {
  const [quests, setQuests] = React.useState(["", "", "", ""]);
  const [players, setPlayers] = useState([]);
  const {lobbyId} =  useParams();
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState("");
  const [admin, setAdmin] = useState(true);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [cityName, setCityName] = useState("");

  function filterNonEmptyQuests(): string[] {
    const nonEmptyQuests = quests.filter((str) => {
      if (typeof str === "string") {
        return str.trim() !== "";
      }
      return false;
    });
    return nonEmptyQuests;
  }

  const addPlayer = (newPlayer: String) => {
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
  };

  const removePlayer = (usernameToRemove) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player !== usernameToRemove));
  };

  useEffect(() => {
    localStorage.setItem("token", "0d1454b7-6dba-4cac-a804-248d3bb52e0d");
    localStorage.setItem("username", "admin");

    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };
      const response = await api.get(`/lobbies/${lobbyId}`, {headers});
      console.log("API Response:", response.data);

      setLobbyName(response.data.name);
      setPlayers(response.data.participants);
      if (response.data.quests === null || response.data.quests.length === 0) {
        setQuests(["", "", "", ""])
      } else {
        setQuests([...response.data.quests, ""]);
      }
      setRoundDurationSeconds(response.data.roundDurationSeconds);
      setCityName(response.data.gameLocation);
      setLat(response.data.gameLocationCoordinates.lat);
      setLng(response.data.gameLocationCoordinates.lng);
      // retrieve lobby information
    }

    fetchData();
  }, [])

  useEffect(() => {
    let client = new Client();
    const websocketUrl = 'ws://localhost:8080/ws';
    client.configure({
      brokerURL: websocketUrl,
      debug: function(str) {
        console.log(str);
      },
      onConnect: () => {
        const destination = `/topic/lobby/` + lobbyId;
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log('Received message:', messageParsed);

          if (messageParsed.status === "joined") {
            addPlayer(messageParsed.username);
          } else if (messageParsed.status === "left") {
            removePlayer(messageParsed.username);
          } else if (messageParsed.status === "update") {
            setCityName(messageParsed.gameLocation);
            if (messageParsed.quests === null || messageParsed.quests.length === 0) {
              setQuests(["", "", "", ""])
            } else {
              setQuests([...messageParsed.quests, ""]);
            }
            setRoundDurationSeconds(messageParsed.roundDurationSeconds);
            setLat(messageParsed.gameLocationCoordinates.lat);
            setLng(messageParsed.gameLocationCoordinates.lng);
          }

        });
      },
    })
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, [])


  const InputQuests = () => {
    const handleQuestChange = (index: number, value: string) => {
      console.log(`Input changed at index ${index} with value: '${value}'`);

      const newQuests = [...quests];
      newQuests[index] = value;

      // Add a new input field if typing in the last one
      if (index === quests.length - 1 && value !== "") {
        newQuests.push("");
      }

      setQuests(newQuests);
    };

    const deleteQuest = (index: number) => {
      const newQuests = [...quests];
      newQuests.splice(index, 1);
      setQuests(newQuests);
    }

    return (
      <ContentWrapper>
        <h6 className="font-bold text-center mt-2 mb-4">Your Quests</h6>
        {quests.map((quest, index) => (
          <Input
            isClearable
            key={index}
            placeholder={`Quest #${index + 1}`}
            value={quest}
            onChange={(e) => handleQuestChange(index, e.target.value)}
            className="mb-2 ml-4 mr-4"
            onClear={() => deleteQuest(index)}
            disabled={!admin}
          />
        ))}
      </ContentWrapper>
    );
  };

  const CityInputField: React.FC = () => {
    //const [cityName, setCityName] = useState("");

    const handleChange = (event) => {
      // Update the cityName state with the new value
      setCityName(event.target.value);
    };

    return (
      <Input
        type="text" // Assuming it's a text input, not email
        label="City"
        title="Enter the name of the city"
        placeholder="Enter city..."
        value={cityName}
        onChange={handleChange}
        style={{ width: "300px" }}
        disabled={!admin}
      />
    );
  };


  const SaveButton: React.FC = () => {
    async function save() {
      const headers = {
        "Authorization": localStorage.getItem("token")
      };
      const body = JSON.stringify({quests: filterNonEmptyQuests(), gameLocation: cityName || "Zürich", roundDurationSeconds});
      try {
        await api.put("/lobbies/" + lobbyId, body, { headers });
      } catch(error) {
        window.alert("There was an error " + error);
      }
    }

    return (
      <Button
        radius="full"
        size = "lg"
        color = "default"
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
        "Authorization": localStorage.getItem("token")
      };
      const response = await api.delete("/lobbies/" + lobbyId + "/leave/", { headers });
      localStorage.removeItem("token");
      navigate("/landing");
    }

    return (
      <Button
        radius="full"
        size = "lg"
        color = "default"
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
    const latitude = lat;
    const longitude = lng;
    const zoom = 10;
    const apiKey = '';

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

  return (
    <BaseContainer size="large" className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-700 my-4 text-center">{lobbyName}</h1>
      <div className="flex w-full">
        <div className="flex flex-col w-full items-start">
          <PlayerTable players={players} />
        </div>
        <div className="flex-1 items-center justify-center">
          <CityInputField />
          <GoogleMapStaticImage />
        </div>
        <div className="flex flex-col w-full items-end mr-8">
          <InputQuests />
        </div>
        <div className="w-full flex justify-between px-12 absolute bottom-16">
          <LeaveButton />
          <StartButton />
          <SaveButton />
        </div>
      </div>
    </BaseContainer>
  );
};

export default Lobby;

  