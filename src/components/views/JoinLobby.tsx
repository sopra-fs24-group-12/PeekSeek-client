// JoinPage.tsx or similar
import React, { useEffect, useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import App from "../ui/LobbyTable";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import Lobby from "models/Lobby";
import PropTypes from "prop-types";
import HowToPlayModal from 'components/ui/HowToPlayModal';
import { InfoCircleTwoTone } from "@ant-design/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button, 
  useDisclosure
} from "@nextui-org/react";


const JoinLobby = () => {
  const navigate = useNavigate();
  const staticMapImageUrl = "URL_STATIC_MAP";
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [lobbyRequiresPassword, setLobbyRequiresPassword] = useState(false);
  const { id } = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleBackClick = () => {
    console.log("Button clicked!");
    navigate("/joinlobby");
  };


  const handleSelectionChange = (selectedKeys) => {

    const selectedKey = selectedKeys[0];

    console.log("selected id " + selectedKeys[0]);
  };

  const handleClickList = () => {
    if (!selectedLobbyId){
      alert("No lobby has been selected!");
    }
    else{console.log("Join button clicked!");
    localStorage.setItem("undefined", String(lobbyRequiresPassword));
    console.log(String(lobbyRequiresPassword));
    navigate("/joinuser/" + selectedLobbyId);}
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

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the lobbies: \n${handleError(
            error,
          )}`,
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the lobbies! See the console for details.",
        );
      }
    }

    fetchData();
  }, []);

  const [selectedColor, setSelectedColor] = React.useState("default");
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [selectedLobbyId, setSelectedLobbyId] = useState();
  const [selectionBehavior, setSelectionBehavior] = React.useState("replace");


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
                  onClick={() => {setSelectedLobbyId(lobby.id); setLobbyRequiresPassword(lobby.passwordProtected);}}
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
          <Button
                onPress={onOpen}
                className="absolute bottom-2 right-2 p-2 sm rounded-full bg-transparent"
                isIconOnly
            >
                <InfoCircleTwoTone style={{ fontSize: '20px'}}/>
            </Button>
            <HowToPlayModal 
              isOpen={isOpen} 
              onOpenChange={onOpenChange}
              context="joinLobby"  />
        </BaseContainer>
      </div>
    </div>
  );
};


export default JoinLobby;