import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { api, handleError } from "helpers/api";
import styled from "styled-components";
import { toast } from "react-toastify";

interface StartButtonProps {
  disabled?: boolean;
  lobbyId: string;
  unsavedChanges: boolean; // New prop to track unsaved changes
}

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
  background-color: rgba(211, 211, 211, 0.9);
  color: black;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 0.2s ease-in-out;
`;

const StartButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled(Button)<{ disabled: boolean }>`
  border-radius: 100%;
  width: 90px;
  height: 90px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.6);
  background: linear-gradient(to bottom right, #38a169, #48bb78);
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  filter: ${props => (props.disabled ? "blur(0.1px)" : "none")};

  &:hover ${Tooltip} {
    opacity: 1;
  }
`;

const StartButton: React.FC<StartButtonProps> = ({ disabled, lobbyId, unsavedChanges }) => {
  const [hovered, setHovered] = useState(false);

  async function doStart() {
    if (disabled || unsavedChanges) {
      toast.info(unsavedChanges ? "You have unsaved changes!" : "Peeking requires 3-6 players.", { autoClose: 3000 });
      
      return;
    }

    const headers = {
      "Authorization": localStorage.getItem("token"),
    };

    try {
      await api.post("/lobbies/" + lobbyId + "/start", null, { headers });
    } catch (error) {
      alert(
        `Something went wrong while starting the game: \n${handleError(error)}`,
      );
    }
  }

  return (
    <StartButtonContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StyledButton disabled={disabled || unsavedChanges} onClick={doStart}>
        Start!
      </StyledButton>
      <Tooltip show={(disabled || unsavedChanges) && hovered}>
        {unsavedChanges ? "You have unsaved changes!" : "Need minimum 3 players in lobby to start!"}
      </Tooltip>
    </StartButtonContainer>
  );
};

export default StartButton;
