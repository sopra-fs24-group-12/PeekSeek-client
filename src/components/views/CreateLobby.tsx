import React, { useState, ChangeEvent } from "react";
import BaseContainer from "../ui/BaseContainer";
import CreateLo from "components/ui/CreateLobbyButton";
import BackButton from "components/ui/BackButton";
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import Lobby from "models/Lobby";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { notification } from "antd";

const CreateLobby = () => {
  const navigate = useNavigate();
  const [name, setLobbyname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setLobbypassword] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [usernameNotificationShown, setUsernameNotificationShown] = useState(false);
  const [lobbyNameNotificationShown, setLobbyNameNotificationShown] = useState(false);
  
  const handleLobbyPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = event.target.value;
    setLobbypassword(newPassword);
  };

  const handleLobbyAdminChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
    if (event.target.value.length === 20 && !usernameNotificationShown) {
      notification.warning({
        message: "Username can be maximum 20 characters!",
        duration: 2,
        key: "username-limit"
      });
      setUsernameNotificationShown(true);
    } else if (event.target.value.length < 20 && usernameNotificationShown) {
      setUsernameNotificationShown(false);
    }
    
  };

  const handleLobbyNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLobbyname(event.target.value);
    if (event.target.value.length === 20 && !lobbyNameNotificationShown) {
      notification.warning({
        message: "Lobby name can be maximum 20 characters!",
        duration: 2,
        key: "lobbyname-limit"
      });
      setLobbyNameNotificationShown(true);
    } else if (event.target.value.length < 20 && lobbyNameNotificationShown) {
      setLobbyNameNotificationShown(false);
    }
  };

  const handleClick = () => {
    console.log("Button clicked!");
    if (!username.trim()){
      alert("Username required!");
    }
    else if (!name.trim()){
      alert("Name required!");
    }
    else{
      doCreate();
    }
  };

  const doCreate = async () => {
    try {

      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/lobbies", requestBody);

      const lobby = new Lobby(response.data);

      localStorage.setItem("token", response.headers["authorization"]);
      localStorage.setItem("username", username);
      localStorage.setItem("submissionDone", "false");
      console.log("This should be the token" + response.headers);

      navigate("/lobby/" + lobby.id);
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`,
      );
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
          className="flex flex-col items-center overflow-hidden max-w-full">
          <div className="flex-row flex-wrap md:flex-nowrap mt-16 mb-16 mr-16 ml-16 gap-4">
            <text>Admin Username</text>
            <Input className="mb-8 shadow-lg" isRequired onChange={handleLobbyAdminChange} radius={"sm"} type="username" label="required " placeholder="..." maxLength={20}
            />
            <text>Lobby Name</text>
            <Input className="mb-8 shadow-lg" isRequired onChange={handleLobbyNameChange} type="name" label="required " placeholder="..." maxLength={20}
            />
            <text>Lobby Password</text>
            <Input className="mb-8 shadow-lg" onChange={handleLobbyPasswordChange} type="password" label="(optional)" placeholder="..." 
            />
          </div>
          <div className="absolute bottom-2 w-full flex flex-col items-center mt-auto gap-2">
            <CreateLo 
              onClick={handleClick} 
              isDisabled={!username.trim() || !name.trim()}
            />
          </div>
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
            context="createLobby"  />
        </BaseContainer>
      </div>
    </div>
  );
};

export default CreateLobby;
