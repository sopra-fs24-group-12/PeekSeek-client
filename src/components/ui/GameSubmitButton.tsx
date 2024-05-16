import React from "react";
import { Button } from "@nextui-org/react";

interface GameSubmitButtonProps {
  onClick: () => void; // Define the onClick prop type
}

const GameSubmitButton: React.FC<GameSubmitButtonProps> = ({ onClick }) => {
  return (
    <Button
      radius="full"
      size = "lg"
      style={{
        fontFamily: "'Lato'",
        fontWeight: 400,
      }}
      className="bg-gradient-to-tr from-brown-500 to-brown-200 text-black shadow-lg"
      onClick={onClick}
    >
      Submit
    </Button>
  );
};

export default GameSubmitButton;