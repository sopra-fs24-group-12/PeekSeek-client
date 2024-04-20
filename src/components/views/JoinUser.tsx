import React, { useEffect, useState } from 'react'; 
import BaseContainer from '../ui/BaseContainer'; 
import CreateButton from 'components/ui/CreateButton';
import BackButton from 'components/ui/BackButton';
import {Input} from "@nextui-org/react"; 
import JoinButton from 'components/ui/JoinButton';
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
    
    const handleBackClick = () => {
        console.log('Button clicked!');
        navigate("/joinlobby");
      };
    /* -- > Ece's code
    useEffect(() => {
        const fetchLobbyData = async () => {
          try {
            /*
            const response = await fetch("backend");    // will change
            const data = await response.json();
            // if requiresPassword is returned as boolean
            setLobbyRequiresPassword(data.requiresPassword);
            const response = await api.get("/lobbies/" + id);

            //await new Promise((resolve) => setTimeout(resolve, 1000));

            //setLobbies(response.data);

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
                console.error("Failed to fetch lobby data:", error);
            } finally {
                setIsLoading(false);
          }
        };
        
        fetchLobbyData();
    }, []);
    */

    const handleJoinClick = async () => {
        try{
        const requestBody = JSON.stringify({username, lobbyPassword});
        const response = await api.put("/lobbies/" + id + "/join", requestBody);
        localStorage.setItem("token:", response.headers);
        if (response.status >= 300){
            navigate("/joinlobby");
        }
        else{
            navigate("/lobby/" + id);
        }
        
    }
        catch(error){
            alert("Please provide the correct password for the lobby you are joining");
            navigate("/joinlobby");
        }
        /* --> Ece's code
        if (!username) {
            setError("Username cannot be empty");
            alert("Username cannot be empty");
        } else {
            console.log("Joining lobby");
            setError(""); // Clear any errors if successful
        }*/
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
                    onChange={(e) => setUsername(e.target.value)}/>
                <text>Lobby Password</text>
                <Input 
                    className="mb-8 shadow-lg" 
                    //isDisabled= {!username}   //{!lobbyRequiresPassword}
                    isClearable
                    value={lobbyPassword}
                    type="pwd" 
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
