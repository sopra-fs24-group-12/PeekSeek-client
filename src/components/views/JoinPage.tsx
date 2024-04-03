import React from 'react';
import BaseContainer from '../ui/BaseContainer'; 
import JoinButton from 'components/ui/JoinButton';
import CreateButton from 'components/ui/CreateButton';
import { Card, Button } from "@nextui-org/react";

const JoinPage = () => {
  return (
    <BaseContainer size="small" className="flex flex-col items-center">
      <div className="flex-grow flex items-center justify-center mb-12">
        <img src="/images/PeekSeek_logo.jpg" alt="PeekSeek Logo" style={{ width: '350px', height: '350px' }}/>
      </div>
      <div className="w-full flex justify-center mb-4">
        <JoinButton/>
      </div>
      <div className="w-full flex justify-center mb-12">
        <CreateButton/>
      </div>
    </BaseContainer>
  );
};

export default JoinPage;
