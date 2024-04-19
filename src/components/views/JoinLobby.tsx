
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
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";


const JoinLobby = () => {
  const navigate = useNavigate();
  const staticMapImageUrl = "URL_STATIC_MAP";
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string> (null);
  //const [id, setID] = useState<string>(null);
  //setID(selectedLobbyID);
  const {id} = useParams();
  const handleBackClick = () => {
    console.log('Button clicked!');
    navigate("/joinlobby");
  };
  const handleClick = () => {
    console.log('Button clicked!');
    doLogin();
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password}); //
      const response = await api.post("/lobbies/" + id + "/join", localStorage.getItem("token"));
      
      //localStorage.setItem("token", response.data.token);
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };


  const handleSelectionChange = (selectedKeys) => {
    // Assuming single selection mode, get the first selected key
    //alert(selectedKeys);
    const selectedKey = selectedKeys[0];
    setSelectedLobbyId(selectedKey);
    console.log("selected id " + selectedKeys[0])    //alert(selectedKey);
  };

  const handleClickList = () => {
    console.log('Button clicked!');
    //localStorage.setItem("token");
    //const response = await api.post("/lobbies/" + id + "/join", localStorage.getItem("token"));
    //alert(selectedLobbyId);
    //navigate("/joinuser/" + selectedLobbyId);
    navigate("/joinuser");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/lobbies");

        //await new Promise((resolve) => setTimeout(resolve, 1000));

        setLobbies(response.data);

        //alert(lobbies);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the lobbies: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the lobbies! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  const [selectedColor, setSelectedColor] = React.useState("default");
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [selectedLobbyId, setSelectedLobbyId] = useState();

  const LobbyTable = () => {

    //console.log(lobbies);
   // console.log(lobbies[0].id)
//code umschreiben um daten vom api call hier sichtbar zu machen
//api call im join.tsx, daten vom api call in Lobby table eingeben, und routing auch
    return (
      <div className="flex flex-col gap-3">
        <Table
          color={"default"}
          selectionMode="single"
          //defaultSelectedKeys={["2"]}
          aria-label="Example static collection table"
          onSelectionChange={handleSelectionChange}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>LOBBY NAME</TableColumn>
            <TableColumn>PARTICIPANTS</TableColumn>
          </TableHeader>
          {lobbies && (
            <TableBody>
              {lobbies.map((lobby: Lobby) =>
                <TableRow key={lobby.id}>
                  <TableCell>{lobby.id}</TableCell>
                  <TableCell>{lobby.name}</TableCell>
                  <TableCell>{lobby.joinedParticipants}</TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
        <div className="w-full flex justify-center mt-24 mb-4">
          <JoinButton
            onClick={handleClickList}/>
        </div>
      </div>

    );
  }


  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-4 left-4">
        <BackButton onClick={handleBackClick}/>
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer 
          size="small" 
          className="flex flex-col items-center">
          <LobbyTable />
          
          <div className="w-full flex justify-center mb-4">
            <CreateButton/>
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default JoinLobby;

//make a useEffect hook call und dadrin die response vom backend holen im backend im Lobbycontroller

