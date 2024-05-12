import React from "react";
import { Button } from "@nextui-org/react";
import { api, handleError } from "helpers/api";
import styled, { css } from 'styled-components';

const slateColor = 'rgb(16,24,50)';
const lightGreenColor = '#B2FFC7'; 
const darkGreenColor = '#19763D'; 

const transitionAll = css`
  -webkit-transition: all 200ms ease-in-out;
  -moz-transition: all 200ms ease-in-out;
  -o-transition: all 200ms ease-in-out;
  transition: all 200ms ease-in-out;
`;

const borderRadius = '12px 12px 0px 0px';

const ThreeDButton = styled.button`
  color: white;
  cursor: pointer;
  display: inline-block;
  letter-spacing: 0.075em;
  padding: 0.6em 1.5em; // Rectangular shape
  margin: auto 2em;
  position: relative;
  align-self: center;
  text-transform: capitalize;
  background: linear-gradient(35deg, ${darkGreenColor} 0%, ${lightGreenColor} 100%);
  border: 3px solid transparent;
  border-image: linear-gradient(35deg, ${darkGreenColor} 0%, ${lightGreenColor} 100%);
  border-image-slice: 1;
  z-index: 1;
  box-shadow: -8px 8px 0 rgba(${slateColor}, 0.4);
  transform-origin: left bottom;
  ${transitionAll};
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  letter-spacing: 0.05em;
  border-radius: ${borderRadius}; // Rounded uniformly

  &:before,
  &:after {
    border: 3px solid transparent;
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    border-radius: ${borderRadius}; // Rounded uniformly for outline
  }

  &:before {
    border-image: linear-gradient(45deg, ${darkGreenColor} 0%, ${darkGreenColor} 100%);
    border-image-slice: 1;
    left: -0.60em;
    top: 0.12em;
    width: 0.31em;
    height: 110%;
    transform: skewY(-45deg);
  }

  &:after {
    border-image: linear-gradient(45deg, ${darkGreenColor} 0%, ${lightGreenColor} 100%);
    border-image-slice: 1;
    bottom: -0.60em;
    right: 0.05em;
    width: 105%;
    height: 0.31em;
    transform: skewX(-45deg);
  }

  &:hover {
    color: ${slateColor}; // Change text color to dark on hover
    background: linear-gradient(35deg, ${lightGreenColor} 0%, ${darkGreenColor} 100%);
    transform: translate(0.3em, -0.3em);
    box-shadow: -10px 10px 15px rgba(${slateColor}, 0.6);
    border-radius: ${borderRadius}; // Keep rounded corners consistent

    // Ensure rounded corners for the outline when hovered
    &:before,
    &:after {
      border-radius: ${borderRadius};
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  height: fit-content;
`;

interface StartButtonProps {
  disabled?: boolean;
  lobbyId: string;
}

const StartButton: React.FC<StartButtonProps> = ({ disabled, lobbyId }) => {
  async function doStart() {
    const headers = {
      "Authorization": localStorage.getItem("token"),
    };

    try {
      const response = await api.post("/lobbies/" + lobbyId + "/start", null, { headers });
    } catch (error) {
      alert(
        `Something went wrong while starting the game: \n${handleError(error)}`,
      );
    }
  }

  return (
    <ButtonContainer>
      <ThreeDButton 
        className= "borderRadius: 100%"
        disabled={disabled} 
        onClick={doStart}>
        Start!
      </ThreeDButton>
    </ButtonContainer>
  );
    
  // return (
  //   <Button
  //     radius="full"
  //     size="lg"
  //     className="bg-gradient-to-br from-green-600 to-green-500 mr-6 shadow-lg"
  //     // make the button round
  //     disabled={disabled}
  //     style={{
  //       borderRadius: "100%",
  //       width: "90px",
  //       height: "90px",
  //       padding: "0",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       fontFamily: "'Roboto', sans-serif",
  //       fontSize: "18px",
  //       fontWeight: "bold",
  //     }}
  //     onClick={doStart}
  //   >
  //     Start!
  //   </Button>
  // );
};

export default StartButton;