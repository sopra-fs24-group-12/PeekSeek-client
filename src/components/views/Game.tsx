import React from 'react';
import BaseContainer from '../ui/BaseContainer';
import BackButton from 'components/ui/BackButton';
import GameButton from 'components/ui/GameButton';
import GameSubmitButton from 'components/ui/GameSubmitButton';
import CreateButton from 'components/ui/CreateButton';


const Game = () => {
  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      <div className="absolute top-4 left-4">
        <BackButton/>
      </div>
      <div className="w-3/4 flex flex-col items-center">
        <BaseContainer size="medium" className="flex flex-col items-center mb-20">
          <h3 className="text-xl font-bold my-4">Find a Landmark in Rome!</h3>
          {/* Placeholder image- map will go here */}
          <img 
          src="/images/placeholder_map.jpg" 
          className="w-full h-full"/>
        </BaseContainer>
        <div className="w-3/4 flex justify-between px-4 absolute bottom-16">
          <GameButton />
          <GameSubmitButton />
        </div>
      </div>
    </div>
  );
};


export default Game;
