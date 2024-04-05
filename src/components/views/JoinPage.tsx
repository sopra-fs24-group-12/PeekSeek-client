// JoinPage.tsx or similar
import React from 'react';
import BaseContainer from '../ui/BaseContainer';
import JoinButton from 'components/ui/JoinButton';
import CreateButton from 'components/ui/CreateButton';
import BackButton from 'components/ui/BackButton';
import LobbyTable from 'components/ui/LobbyTable';

const JoinPage = () => {
  // ...useNavigate and other hooks or states

  return (
    <div className="relative min-h-screen w-screen">
      <div className="absolute inset-x-0 top-4 left-4">
        <BackButton/>
      </div>
      <div className="flex justify-center items-center h-full">
        <BaseContainer 
          size="small" 
          className="flex flex-col items-center">
          <LobbyTable />
          <div className="w-full flex justify-center mt-8 mb-4">
            <JoinButton />
            <CreateButton />
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default JoinPage;