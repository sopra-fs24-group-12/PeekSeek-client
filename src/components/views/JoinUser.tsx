import React, { useEffect, useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import { Input, Button, useDisclosure } from "@nextui-org/react";
import JoinButton from "components/ui/JoinButton";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { notification } from "antd";
import ErrorMessageModal from "components/ui/ErrorMessageModal";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [usernameNotificationShown, setUsernameNotificationShown] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lobbyNotExisting, setLobbyNotExisting] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await api.get("/lobbies");


        // console.log("request to:", response.request.responseURL);
        // console.log("status code:", response.status);
        // console.log("status text:", response.statusText);
        // console.log("requested data:", response.data);

        //console.log(response);

        const lobbyToJoin = response.data.find(obj => obj.id === parseInt(id));

        if (lobbyToJoin) {
          setLobbyRequiresPassword(lobbyToJoin.passwordProtected)
        } else {
          setErrorMessage("A lobby with this ID does not exist");
          setErrorModalOpen(true);
          setLobbyNotExisting(true);
          localStorage.clear()
        }
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setLobbyNotExisting(true);
        setErrorModalOpen(true);
        localStorage.clear()
      }
    };
    sendRequest();
  }, []);

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
      //console.log(localStorage.getItem("token"));
      if (response.status >= 300) {
        navigate("/join");
      } else {
        navigate("/lobby/" + id);
      }

    } catch (error) {
      console.log("Error caught:", error.response.data.message);
      setErrorMessage(error.response.data.message);
      setErrorModalOpen(true);
    }

  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value.slice(0, 20);
    setUsername(newUsername);

    if (e.target.value.trim().length === 20 && !usernameNotificationShown) {
      notification.warning({
        message: "Username can be maximum 20 characters!",
        duration: 2,
        key: "username-limit"
      });
      setUsernameNotificationShown(true);
    } else if (e.target.value.trim().length < 20 && usernameNotificationShown) {
      setUsernameNotificationShown(false);
    }
  };
  console.log("Error Modal Open:", errorModalOpen, "Message:", errorMessage);

  function handleErrorOnJoin() {
    setErrorModalOpen(false);
    if (lobbyNotExisting) {
      navigate("/landing/");
    }
  }

  return (
    <>
      {errorModalOpen && <ErrorMessageModal isOpen={errorModalOpen} onClose={() => handleErrorOnJoin()} errorMessage={errorMessage} />}
      <div className="relative min-h-screen w-screen">
        <div className="absolute top-4 left-4 z-50">
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-full">
          <BaseContainer
            size="small"
            className="flex flex-col items-center overflow-hidden max-w-full">
            <div className="flex-row flex-wrap md:flex-nowrap mt-16 mb-16 mr-16 ml-16 gap-4">
              <text>Username</text>
              <Input
                className="mb-8 shadow-lg"
                isRequired
                isClearable
                onClear={() => setUsername("")}
                radius={"sm"}
                type="username"
                label="required "
                placeholder="..."
                value={username}
                onChange={handleUsernameChange}
              />
              <text>Lobby Password</text>
              <Input
                className="mb-8 shadow-lg"
                isDisabled= {!lobbyRequiresPassword}
                isClearable
                onClear={() => setLobbyPassword("")}
                value={lobbyPassword}
                type="password"
                label="  "
                placeholder="..."
                onChange={(e) => setLobbyPassword(e.target.value)} />
            </div>
            <div className="absolute bottom-2 w-full flex flex-col items-center mt-auto gap-2">
              <JoinButton
                isDisabled={!username.trim() || (lobbyRequiresPassword && !lobbyPassword)}
                onClick={handleJoinClick} />
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
              context="joinUser"  />
          </BaseContainer>
        </div>
      </div>
    </>
  );

};

export default JoinUser;
