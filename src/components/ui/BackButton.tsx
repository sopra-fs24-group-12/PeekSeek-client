import React from "react";
import { Button } from "@nextui-org/react";

const BackButton: React.FC = () => {
  return (
    <Button
      radius="full"
      size = "lg"
      className="shadow-lg"
      onClick={() => {
        console.log("Looking to create a lobby");
        // Place your logic here
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;