
// JoinPage.tsx or similar
import React, { useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import LobbyTable from "components/ui/LobbyTable";
import App from "../ui/LobbyTable";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";


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

