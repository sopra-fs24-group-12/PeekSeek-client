import React from "react";
import { Button } from "@nextui-org/react";

const GameSubmitButton: React.FC = () => {
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-brown-500 to-brown-200 text-black shadow-lg"
      onClick={() => {
        console.log("Looking to create a lobby");
        // Place your logic here
      }}
    >
      Submit
    </Button>
  );
};

export default GameSubmitButton;