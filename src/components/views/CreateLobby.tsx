import React from 'react';
import BaseContainer from '../ui/BaseContainer'; 
import JoinButton from 'components/ui/JoinButton';
import CreateButton from 'components/ui/CreateButton';
import BackButton from 'components/ui/BackButton';
import {Input} from "@nextui-org/react"; 
import { useNavigate } from "react-router-dom";


const CreateLobby = () => {

    const radius = ["sm"]

return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute inset-x-0 top-4 left-4">
        <BackButton/>
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer 
          size="small" 
          className="flex flex-col items-center">
          <div className="flex-row flex-wrap md:flex-nowrap mt-16 mb-16 mr-16 ml-16 gap-4">
            <text>Admin Username</text>
            <Input className="mb-8 shadow-lg" isRequired radius={radius} type="username" label="required " placeholder="..."/>
            <text>Lobby Name</text>
            <Input className="mb-8 shadow-lg" isRequired type="name" label="required " placeholder="..." />
            <text>Lobby Password</text>
            <Input className="mb-8 shadow-lg" type="pwd" label="(optional)" placeholder="..." />
          </div>
          <div className="w-full flex justify-center mt-36 mb-4">
            <CreateButton/>
          </div>
        </BaseContainer>
      </div>
    </div>
  );

};

export default CreateLobby;
