import React from "react";
import { Button } from "@nextui-org/react";

interface JoinButtonProps {
  isDisabled?: boolean;
}

const JoinButton: React.FC<JoinButtonProps> = ({ isDisabled }) => {
  return (
    <Button
      disabled={isDisabled}
      radius="full"
      className="bg-gradient-to-tr from-blue-500 to-blue-200 text-black shadow-lg"
      onClick={() => {
        if (!isDisabled) {
          console.log("Joining lobby");
          // Place your logic here
        }
      }}
    >
      Join
    </Button>
  );
};

export default JoinButton;