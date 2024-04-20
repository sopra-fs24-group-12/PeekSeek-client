import React from "react";
import { Button } from "@nextui-org/react";
import { api, handleError } from "helpers/api";

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
      const response = await api.post("/lobbies/" + lobbyId + "/start", { headers });
      console.log("Game start requested");
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
      className="bg-gradient-to-tr from-green-600 to-green-600 mr-6 shadow-lg"
      // make the button round
      disabled={disabled}
      style={{
        borderRadius: "100%",
        width: "80px",
        height: "90px",
        padding: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={doStart}
    >
      Start!
    </Button>
  );
};

export default StartButton;