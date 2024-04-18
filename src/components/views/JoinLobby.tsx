import React from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import BackButton from "components/ui/BackButton";
import LobbyTable from "components/ui/LobbyTable";

const JoinLobby = () => {

  const staticMapImageUrl = "URL_STATIC_MAP";

  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute top-4 left-4">
        <BackButton/>
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer 
          size="small" 
          className="flex flex-col items-center">
          <LobbyTable />
          <div className="w-full flex justify-center mt-24 mb-4">
            <JoinButton
              isDisabled={true}/>
          </div>
          <div className="w-full flex justify-center mb-4">
            <CreateButton/>
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default JoinLobby;
