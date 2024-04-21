import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const CreateButton: React.FC = () => {
  const navigate = useNavigate();
  const create = (): void => {
    navigate("/create");
  };

  return (
    <Button
      radius="full"
      size="lg"
      className="bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg"
      onClick={() => {
        console.log("Looking to create a lobby");
        create();
      }}
    >
      Create Lobby
    </Button>
  );
};

export default CreateButton;