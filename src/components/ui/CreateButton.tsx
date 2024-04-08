import React from "react";
import { Button } from "@nextui-org/react";

const CreateButton: React.FC = () => {
  return (
    <Button
      radius="full"
      size = "lg"
      className="bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg"
      onClick={() => {
        console.log("Looking to create a lobby");
        // Place your logic here
      }}
    >
      Create Lobby
    </Button>
  );
};

export default CreateButton;