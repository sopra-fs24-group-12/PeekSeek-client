import React, { useEffect, useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import { Input } from "@nextui-org/react";
import JoinButton from "components/ui/JoinButton";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";


const JoinUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");
  const [error, setError] = useState("");
  const [lobbyRequiresPassword, setLobbyRequiresPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const isJoinDisabled = !username || (lobbyRequiresPassword && !lobbyPassword);
  const [usernameError, setUsernameError] = useState("");

  const handleBackClick = () => {
    console.log("Button clicked!");
    navigate("/joinlobby");
  };


  const handleJoinClick = async () => {
    try {
      if (!username.trim()){
        setUsernameError("Username is required.");
        alert("Username Required!");

        return;
      }
      const requestBody = JSON.stringify({ username, lobbyPassword });
      const response = await api.put("/lobbies/" + id + "/join", requestBody);
      localStorage.setItem("token", response.headers["authorization"]);
      localStorage.setItem("username", username);
      localStorage.setItem("submissionDone", "false");
      console.log(localStorage.getItem("token"));
      if (response.status >= 300) {
        navigate("/joinlobby");
      } else {
        navigate("/lobby/" + id);
      }

    } catch (error) {
      alert(
        `Something went wrong during joining: \n${handleError(error)}`,
      );
    }

  };
  const handleUsernameChange = (e) => {
    const trimmedUsername = e.target.value.trim();
    if (trimmedUsername) {
      setUsername(trimmedUsername);
      setUsernameError("");
    } else {
      setUsernameError("Username is required.");
    }
  };

  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-4 left-4 z-50">
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
              onChange={handleUsernameChange}
            />
            <text>Lobby Password</text>
            <Input
              className="mb-8 shadow-lg"
              //isDisabled= {!username}   //{!lobbyRequiresPassword}
              isClearable
              value={lobbyPassword}
              type="password"
              label="  "
              placeholder="..."
              onChange={(e) => setLobbyPassword(e.target.value)} />
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
