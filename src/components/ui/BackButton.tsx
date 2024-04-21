import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";


const BackButton: React.FC = () => {

  const navigate = useNavigate();

  return (
    <Button
      className="items-center"
      radius="full"
      size = "lg"
      color = "default"
      onClick={() => {
        console.log("Back to Dashboard Button clicked!");
        localStorage.clear();
        navigate("/landing");
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;