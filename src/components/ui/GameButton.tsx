import React from "react";
import { Button } from "@nextui-org/react";

const GameButton: React.FC = () => {
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-brown-500 to-brown-200 text-black shadow-lg"
      onClick={() => {
        console.log("Giving up on game");
        // Place your logic here
      }}
    >
      Cannot find it!
    </Button>
  );
};

export default GameButton;