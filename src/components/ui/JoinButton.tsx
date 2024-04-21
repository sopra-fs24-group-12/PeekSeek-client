import React from "react";
import { Button } from "@nextui-org/react";
import App from "../ui/LobbyTable";

interface JoinButtonProps {
  isDisabled?: boolean;
  onClick?: () => void;
}


const JoinButton: React.FC<JoinButtonProps> = ({ isDisabled, onClick }) => {

  return (
    <Button
      radius="full"
      size="lg"
      style={isDisabled ? { filter: "blur(0.5px)", color: "gray" } : {}}
      className="bg-gradient-to-tr from-blue-500 to-blue-200 text-black shadow-lg"
      onClick={onClick}
    >
      Join
    </Button>
  );
};

export default JoinButton;