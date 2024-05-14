import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface HowToPlayModalProps {
isOpen: boolean;
onOpenChange: (isOpen: boolean) => void;
context: string;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onOpenChange, context }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  const getContent = () => {
    switch (context) {
    case "landing":
      return (
        <>
          <div className="text-justify">
            <div className="font-bold mb-6">
            🗺️ Ready to explore your next travel destination? 
            </div>
            <ul>
              <li className="mb-4"> Whether you know exactly where to go or torn between different destinations, PeekSeek is all you need to discover your destination together with your travel buddies. </li>
              <li className="mb-2">1. You will start by creating a lobby or joining an existing lobby. If joining a lobby, sit back and enjoy. If creating the lobby, you will have the honors of choosing the destination and quests. </li>
              <li className="mb-2">2. All players will navigate on Google Maps to find the locations defined in the quest.</li>
              <li className="mb-2">3. Time to vote! Pick the location you would like to visit the most and ban the one(s) you think are not reflective of the quest.</li>
              <li className="mb-2">4. You will collect points based on how quickly you spot the location and votes. </li>
              <li className="mb-6">5. Congrats, you have explored your destination! 🥳 You now have a final map marked with all winning locations and direct links for each. </li>
            </ul>
            PS. You will find specific guidance on every page. When in doubt, just click the info icon!
          </div>
        </>
      );
    case "joinLobby":
      return (
        <>
          <div className="text-justify">
            <ul>
              <li className="mb-2">1. Select a lobby you would like to join.</li>
              <li className="mb-4">2. Click the Join button!</li>
            </ul>
            Changed your mind? No worries, you can still create your own lobby.
          </div>
        </>
      );
    case "createLobby":
      return (
        <>
          <div className="text-justify">
            <ul>
              <li className="mb-2">1. Enter your username and lobby name.</li>
              <li className="mb-2">2. Optionally, you can add a lobby password to make it private. In that case, dont forget to share the password with your friends!</li>
            </ul>
          </div>
        </>
      );
    case "joinUser":
      return (
        <>
          <div className="text-justify">
            <ul>
              <li className="mb-2">1. Enter your username.</li>
              <li className="mb-2">2. If the lobby password field is enabled, it means the selected lobby is password protected.</li>
            </ul>
          </div>
        </>
      );
    case "lobby":
      return (
        <>
          <div className="text-justify">
            <ul>
              <li className="mb-2">1. Select time per round.</li>
              <li className="mb-2">2. Enter destination and click on Save Destination button.</li>
              <li className="mb-2">3. Enter as many quests as you want and click on Save Quests button.</li>
              <li className="mb-2">4. All set? Click Update button to share the game settings with all players. Dont worry, you can still make changes. Just make sure to update again.</li>
              <li className="mb-2">5. Finally, click Start to explore your next destination!</li>
            </ul>
          </div>
        </>
      );
    case "game":
      return (
        <>
          <div className="text-justify">
            <div className="font-bold mb-6">
              Time to explore!
            </div>
            <ul>
              <li className="mb-2">1. Navigate in the map to find the location given in your quest. The quest is written right above the map. You can zoom in/out the map by clicking the buttons on the right bottom corner.</li>
              <li className="mb-2">2. Drop the Pegman on the map to switch to Street View.</li>
              <li className="mb-4">3. Found the location? Click Submit!</li>
            </ul>
            If you cannot find the location within the round duration, you can click the Can&apos;t find it! button to pass this round. If the time runs out before you make a submission, you will be automatically making an empty submission. Remember, time counts! Fastest submission gets the speed bonus.
          </div>
        </>
      );
    case "gamesubmission":
      return (
        <>
          <div className="text-justify">
            <div className="font-bold mb-6">
              Time to vote! 
            </div>
            <ul>
              <li className="mb-2">1. Vote for the submission you would like to visit the most.</li>
              <li className="mb-2">2. Ban the submissions that you think are unsuitable for the location you were meant to find.</li>
              <li className="mb-2">3. Finally, click Submit to finalize your vote.</li>
            </ul>
          </div>
        </>
      );
    case "gamesummary":
      return (
        <>
          <div className="text-justify">
            <div className="font-bold mb-6">
              Drum roll 🥁
            </div>
            <ul>
              <li className="mb-2">Here is your final map!</li>
              <li className="mb-2">• The map is marked with all the winning locations. Now you have an idea of where you will be visiting around the city.</li>
              <li className="mb-2">• You can click on the links to further discover each winning location.</li>
            </ul>
          </div>
        </>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          {getContent()}
        </ModalBody>
        <ModalFooter>
          <Button 
            className="bg-transparent sm rounded-full"
            color="default"
            onPress={handleClose}>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HowToPlayModal;
