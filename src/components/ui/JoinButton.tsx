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
      style={{
        filter: isDisabled ? "blur(0.1px)" : "",
        color: isDisabled ? "gray" : "black",
        fontFamily: "'Lato'",
        fontWeight: 400,
      }}
      className={`w-[120px] mr-4 bg-gradient-to-tr from-blue-500 to-blue-200 text-black shadow-lg ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      Join
    </Button>
  );
};

export default JoinButton;