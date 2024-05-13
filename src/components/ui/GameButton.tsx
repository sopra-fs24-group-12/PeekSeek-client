import React from "react";
import { Button } from "@nextui-org/react";


interface GameButtonProps {
  onClick: () => void; // Define the onClick prop type
}

const GameButton: React.FC<GameButtonProps> = ({ onClick }) => {
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-brown-500 to-brown-200 text-black shadow-lg"
      onClick={onClick}
    >
      Can&apos;t find it!
    </Button>
  );
};

export default GameButton;