import React from "react";
import { Button } from "@nextui-org/react";

const BackButton: React.FC = () => {
  return (
    <Button
      className="items-center shadow-lg"
      radius="full"
      size = "lg"
      color = "default"
      onClick={() => {
        console.log("Going back");
        // Place your submit logic here
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;
