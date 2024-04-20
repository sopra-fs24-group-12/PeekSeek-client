import React, { useEffect, useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import { Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import JoinButton from "components/ui/JoinButton";


const JoinUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lobbyRequiresPassword, setLobbyRequiresPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isJoinDisabled = !username || (lobbyRequiresPassword && !password);

  useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        const response = await fetch("backend");    // will change
        const data = await response.json();
        // if requiresPassword is returned as boolean
        setLobbyRequiresPassword(data.requiresPassword);
      } catch (error) {
        console.error("Failed to fetch lobby data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLobbyData();
  }, []);


  const handleJoinClick = () => {
    if (!username) {
      setError("Username cannot be empty");
      alert("Username cannot be empty");
    } else {
      console.log("Joining lobby");
      setError(""); // Clear any errors if successful
    }
  };


  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer
          size="small"
          className="flex flex-col items-center">
          <div className="flex-row flex-wrap md:flex-nowrap mt-16 mb-16 mr-16 ml-16 gap-4">
            <text>Username</text>
            <Input
              className="mb-8 shadow-lg"
              isRequired
              isClearable
              radius={"sm"}
              type="username"
              label="required "
              placeholder="..."
              onChange={(e) => setUsername(e.target.value)} />
            <text>Lobby Password</text>
            <Input
              className="mb-8 shadow-lg"
              isDisabled={!lobbyRequiresPassword}
              isClearable
              value={password}
              type="pwd"
              label="  "
              placeholder="..."
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="w-full flex justify-center mt-36 mb-4">
            <JoinButton
              isDisabled={isJoinDisabled}
              onClick={handleJoinClick} />
          </div>
        </BaseContainer>
      </div>
    </div>
  );

};

export default JoinUser;
