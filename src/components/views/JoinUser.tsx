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
    

    const handleJoinClick = async () => {
        try{
        const requestBody = JSON.stringify({username, lobbyPassword});
        const response = await api.put("/lobbies/" + id + "/join", requestBody);
        localStorage.setItem("token", response.headers);
        localStorage.setItem("username", username);
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
