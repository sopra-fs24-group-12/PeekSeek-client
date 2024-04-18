import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import LeaveButton from "../ui/LeaveButton";
import StartButton from "../ui/StartButton";
import PlayerTable from "../ui/PlayerTable";
import AutocompleteDestination from "../ui/AutocompleteDestination";
import InputQuest from "components/ui/InputQuest"
import DropdownDestination from "components/ui/DropdownDestination"


const Lobby = () => {
  const [quest, setQuest] = React.useState("");

  return (
    <BaseContainer 
      size="large" 
      className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-700 my-4 text-center">Lobby Name</h1>
      <div className="flex w-full justify-between gap-8">
        <div className="flex-1 mr-8">
          <PlayerTable />
        </div>
        <div className="flex flex-col items-center gap-8">
          <DropdownDestination />
          <div className="rounded-full overflow-hidden shadow-lg" 
            style={{ width: "400px", height: "400px" }}>
            <img
              // src={staticMapImageUrl}
              src="/images/placeholder_map.jpg" 
              alt="Static Map"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1 mr-8">
          <InputQuest />
        </div>
        <div className="w-full flex justify-between px-12 absolute bottom-16">
          <LeaveButton />
          <StartButton />
        </div>
      </div>
    </BaseContainer>
  );
};

export default Lobby;
