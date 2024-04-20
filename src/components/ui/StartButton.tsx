import React from "react";
import { Button } from "@nextui-org/react";

interface StartButtonProps {
  disabled?: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ disabled }) => {
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-green-600 to-green-600 mr-6 shadow-lg"
      // make the button round
      disabled={disabled}
      style={{
        borderRadius: '100%',
        width: '80px', 
        height: '90px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => {
        console.log("Starting game");
        // Place your logic here
      }}
    >
      Start!
    </Button>
  );
};

export default StartButton;