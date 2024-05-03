import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onOpenChange }) => {
    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>
                    Ready to explore your next travel destination?
                </ModalHeader>
                <ModalBody>
                    Here is how to peek!
                    <ul>
                        <li>1. Start by creating a lobby or joining an existing lobby.</li>
                        <li>2. If joining a lobby, sit back and enjoy. If creating the lobby, you will have the honors 
                            of choosing the time per round, destination and quests as the admin. Once all set, you can start the game.</li>
                        <li>3. Navigate on Google Maps to find the locations given in the quest. Though be quick, as the time</li>
                        <li>4. Time to vote! Pick the location you would like to visit the most and ban the one(s) you think are not reflective of the quest.</li>
                        <li>5. Completed all quests? Congrats, you have explored your destination! Have a look at the game summary, 
                            where you will find the map marked with all winning locations and direct links for each.</li>
                    </ul>
                    PS. You will find specific guidance on every page. When in doubt, just click the info icon!
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
