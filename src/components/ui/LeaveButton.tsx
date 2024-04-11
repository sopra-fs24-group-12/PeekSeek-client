import React from "react";
import { Button } from "@nextui-org/react";

const LeaveButton: React.FC = () => {
  return (
    <Button
      radius="full"
      size = "lg"
      color = "default"
      className="shadow-lg"
      onClick={() => {
        console.log("Leaving lobby");
        // Place your logic here
      }}
    >
      Leave Lobby
    </Button>
  );
};

export default LeaveButton;