import React from "react";
import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge"

const SubmitButton: React.FC = () => {
  return (
    <Button
      className="items-center"
      radius="full"
      size = "lg"
      color = "warning"
      onClick={() => {
        console.log("Submit action triggered");
        // Place your submit logic here
      }}
    >
      Submit your Pick!
    </Button>
  );
};

export default SubmitButton;
