import React, { useEffect, useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import Lobby from "models/Lobby";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";


const JoinLobby = () => {
  const navigate = useNavigate();
  const [lobbyRequiresPassword, setLobbyRequiresPassword] = useState(false);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [selectedLobbyId, setSelectedLobbyId] = useState();


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

        setLobbies(response.data);

        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        console.log(response);
      } catch (error) {
        alert(
          `Something went wrong while fetching information: \n${handleError(error)}`,
        );
        localStorage.clear()
        navigate("/landing");
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

  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-4 left-4 z-50">
        <BackButton />
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer size="small" className="flex flex-col items-center">
          <Table
            color={"default"}
            selectionMode="single"
            aria-label="Example static collection table"
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>LOBBY NAME</TableColumn>
              <TableColumn>PARTICIPANTS</TableColumn>
              <TableColumn>PASSWORD</TableColumn>
            </TableHeader>
            <TableBody>
              {lobbies.map((lobby: Lobby) => (
                <TableRow
                  key={lobby.id}
                  onClick={() => {selectLobby(lobby.id); setLobbyRequiresPassword(lobby.passwordProtected);}}
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
          <div className="w-full flex justify-center mt-24 mb-4">
            <JoinButton
              onClick={handleClickList}
              isDisabled={!selectedLobbyId}
            />
          </div>
          <div className="w-full flex justify-center mb-4">
            <CreateButton />
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};


export default JoinLobby;