import React from "react";
import { Button } from "@nextui-org/react";

const StartButton: React.FC = () => {
  return (
    <Button
      radius="full"
      size = "lg"
      color = "default"
      className="bg-gradient-to-tr from-green-600 to-green-600 mr-6 shadow-lg"
      onClick={() => {
        console.log("Leaving lobby");
        // Place your logic here
      }}
    >
      Start
    </Button>
  );
};

export default StartButton;