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
                <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>
                    Ready to explore your next travel destination?
                </div>
                <ul>
                    <li>1. Start by creating a lobby or joining an existing lobby.</li>
                    <li>2. If joining a lobby, sit back and enjoy. If creating the lobby, you will have the honors 
                        of choosing the time per round, destination and quests as the admin. Once all set, you can start the game.</li>
                    <li>3. Navigate on Google Maps to find the locations given in the quest. Though be quick, as the time</li>
                    <li>4. Time to vote! Pick the location you would like to visit the most and ban the one(s) you think are not reflective of the quest.</li>
                    <li>5. Completed all quests? Congrats, you have explored your destination! Have a look at the game summary, 
                        where you will find the map marked with all winning locations and direct links for each.</li>
                <div style={{ marginTop: "16px" }}>
                    PS. You will find specific guidance on every page. When in doubt, just click the info icon!
                </div>
                </ul>
                </>
            );
        case "joinLobby":
            return (
                <ul> 
                    <li>1. Select a lobby you would like to join.</li>
                    <li>2. Click the Join button!</li>
                <div style={{ marginTop: "16px" }}>
                    Changed your mind? No worries, you can still create your own lobby.
                </div>
                </ul>
            );
        case "createLobby":
            return (
                <ul> 
                    <li>1. Enter your username and lobby name.</li>
                    <li>2. Optionally, you can add a lobby password to make it private. In that case, dont forget to share the password with your friends!</li>
                </ul>
            );
        case "joinUser":
            return (
                <ul> 
                    <li>1. Enter your username.</li>
                    <li>2. If the lobby has a password, you must enter that as well!</li>
                </ul>
                );
            case "lobby":
                return (
                    <ul> 
                        <li>1. Select time per round.</li>
                        <li>2. Enter destination and click on Save Destination button.</li>
                        <li>3. Enter as many quests as you want and click on Save Quests button.</li>
                        <li>4. All set? Click on Publish Settings to share the game settings with all the players. 
                            Dont worry, you can still make changes. Just make sure to save and publish again.</li>
                        <li>5. Finally, click Start to explore your next destination!</li>
                    </ul>
                );
            case "game":
                return (
                    <>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>
                        Time to explore!
                    </div>
                    <ul> 
                        <li>1. Navigate in the map to find the location given in your quest. The quest is written right above the map.
                            You can zoom in/out the map by clicking the buttons on the right bottom corner.</li>
                        <li>2. Drop the Pegman on the map to switch to Street View.</li>
                        <li>3. Found the location? Click Submit!</li>
                    <div style={{ marginTop: "16px" }}>
                        If you cannot find the location within the round duration, you can click the Cannot find it! button to pass this round.
                        If the time runs out before you make a submission, you will be automatically making an empty submission. 
                        Remember, time counts! Fastest submission gets the speed bonus.
                    </div>
                    </ul>
                    </>
                );
            case "gamesubmission":
                return (
                <>
                <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>
                    Time to vote!
                </div>
                    <ul> 
                        <li>1. Vote for the submission you would like to visit the most.</li>
                        <li>2. Ban the submissions that you think are unsuitable for the location you were meant to find.</li>
                        <li>3. Finally, click Submit to finalize your vote.</li>
                    </ul>
                </>
                );
            case "gamesummary":
                return (
                <>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>
                        Drum roll 🥁
                    </div>
                    <ul> 
                        <li>Here is your final map!</li>
                        <li>The map is marked with all the winning locations. Now you have an idea of where you will be visiting around the city.</li>
                        <li>You can click on the links to further discover each winning location.</li>
                    </ul>
                </>
                );
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalContent>
                <ModalHeader>
                </ModalHeader>
                <ModalBody>
                    {getContent()}
                </ModalBody>
                <ModalFooter>
                    <Button 
                        className = "bg-transparent sm rounded-full"
                        color="default" 
                        isIconOnly
                        onPress={handleClose}>
                        ⛌
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default HowToPlayModal;
