import React from "react";
import { Button } from "@nextui-org/react";
import { api, handleError } from "helpers/api";
import styled, { css } from "styled-components";


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
    <Button
      radius="full"
      size="lg"
      className="flex-center bg-gradient-to-br from-green-500 to-green-400 shadow-lg"
      disabled={disabled}
      style={{
        borderRadius: "100%",
        width: "90px",
        height: "90px",
        padding: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.6)", 
      }}
      onClick={doStart}
    >
      Start!
    </Button>
  );
};

export default StartButton;