import React, { useState, ChangeEvent } from "react";
import BaseContainer from "../ui/BaseContainer";
import CreateLo from "components/ui/CreateLobbyButton";
import BackButton from "components/ui/BackButton";
import { Input } from "@nextui-org/react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Lobby from "models/Lobby";

const CreateLobby = () => {
  const navigate = useNavigate();
  const [name, setLobbyname] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [password, setLobbypassword] = useState<string>("");
  const handleLobbyPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {

    const newPassword = event.target.value;

    setLobbypassword(newPassword);
  };
  const handleLobbyAdminChange = (event: ChangeEvent<HTMLInputElement>): void => {

    const newUsername = event.target.value;

    setUsername(newUsername);
  };
  const handleLobbyNameChange = (event: ChangeEvent<HTMLInputElement>): void => {

    const newLobbyname = event.target.value;

    setLobbyname(newLobbyname);
  };
  const handleClick = () => {
    console.log("Button clicked!");
    doCreate();
  };
  const handleBackClick = () => {
    console.log("Back button clicked!");
    navigate("/joinlobby");
  };
  const doCreate = async () => {
    try {

      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/lobbies", requestBody);

      const lobby = new Lobby(response.data);


      localStorage.setItem("token", response.headers["authorization"]);
      localStorage.setItem("username", username);
      console.log("This should be the token" + response.headers);


      navigate("/lobby/" + lobby.id);
    } catch (error) {
      alert(
        `Something went wrong during the registration, choose another username: \n${handleError(error)}`,
      );
      navigate("/joinlobby");
    }

  };

  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-4 left-4">
        <BackButton onClick={handleBackClick} />
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer
          size="small"
          className="flex flex-col items-center">
          <div className="flex-row flex-wrap md:flex-nowrap mt-16 mb-16 mr-16 ml-16 gap-4">
            <text>Admin Username</text>
            <Input className="mb-8 shadow-lg" isRequired onChange={handleLobbyAdminChange} radius={"sm"} type="username" label="required " placeholder="..." />
            <text>Lobby Name</text>
            <Input className="mb-8 shadow-lg" isRequired onChange={handleLobbyNameChange} type="name" label="required " placeholder="..." />
            <text>Lobby Password</text>
            <Input className="mb-8 shadow-lg" onChange={handleLobbyPasswordChange} type="password" label="(optional)" placeholder="..." />
          </div>
          <div className="w-full flex justify-center mt-36 mb-4">
            <CreateLo onClick={handleClick} disabled={!username || !name} />
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default CreateLobby;
