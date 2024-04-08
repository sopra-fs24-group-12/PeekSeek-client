import React from "react";
import { Button } from "@nextui-org/react";

const BackButton: React.FC = () => {
  return (
    <Button
      className="items-center"
      radius="full"
      size = "lg"
      color = "default"
      onClick={() => {
        console.log("Going back");
        // Pl ace your submit logic here
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;