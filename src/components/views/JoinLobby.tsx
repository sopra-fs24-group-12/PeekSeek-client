import React, { useEffect, useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import Lobby from "models/Lobby";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner, 
  Button, 
  useDisclosure
} from "@nextui-org/react";
import ErrorMessageModal from "components/ui/ErrorMessageModal";

const JoinLobby = () => {
  const navigate = useNavigate();
  const [lobbyRequiresPassword, setLobbyRequiresPassword] = useState(false);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [selectedLobbyId, setSelectedLobbyId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickList = () => {
    console.log("Join button clicked!");
    localStorage.setItem("undefined", String(lobbyRequiresPassword));
    console.log(String(lobbyRequiresPassword));
    navigate("/join/" + selectedLobbyId);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/lobbies");

        setTimeout(() => {
          setLobbies(response.data);
          setIsLoading(false);
        }, 1000);
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        console.log(response);
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
        localStorage.clear()
      }
    }

    fetchData();
  }, []);

  function selectLobby(id) {
    if (selectedLobbyId !== id) {
      setSelectedLobbyId(id)
    } else {
      setSelectedLobbyId(null)
    }
  }

  function handleErrorOnJoinLobbyPage() {
    setErrorModalOpen(false);
    navigate("/landing/");
  }

  return (
    <>
      {errorModalOpen && <ErrorMessageModal isOpen={errorModalOpen} onClose={() => handleErrorOnJoinLobbyPage()} errorMessage={errorMessage} />}
      <div className="relative min-h-screen w-screen">
        <div className="absolute top-4 left-4 z-50">
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-full">
          <BaseContainer size="small" className="flex flex-col items-center">
            <div className="flex-grow w-full overflow-hidden rounded-lg mb-4" style={{ maxHeight: "85%" }}>
              <Table
                isHeaderSticky
                color={"primary"}
                selectionMode="single"
                aria-label="Lobby Table"
                classNames={{
                  base: "overflow-y-auto h-[530px] min-h-[530px]",
                }}
              >
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>LOBBY</TableColumn>
                  <TableColumn>PLAYERS</TableColumn>
                  <TableColumn>🔒</TableColumn>
                </TableHeader>
                <TableBody
                  isLoading={isLoading}
                  emptyContent={<Spinner size="md" color="default" />}
                >
                  {lobbies.map((lobby: Lobby) => (
                    <TableRow
                      key={lobby.id}
                      onClick={() => {
                        selectLobby(lobby.id);
                        setLobbyRequiresPassword(lobby.passwordProtected);
                      }}
                      className={
                        selectedLobbyId === lobby.id ? "selected-row" : ""
                      }
                    >
                      <TableCell>{lobby.id}</TableCell>
                      <TableCell>{lobby.name}</TableCell>
                      <TableCell>
                        {lobby.joinedParticipants} / {lobby.maxParticipants}
                      </TableCell>
                      <TableCell>
                        {lobby.passwordProtected ? "🔒" : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="w-full flex justify-center mt-auto mb-4">
              <JoinButton
                onClick={handleClickList}
                isDisabled={!selectedLobbyId}
              />
            </div>
            <div className="w-full flex justify-center mb-4">
              <CreateButton />
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
    </>
  );
};


export default JoinLobby;