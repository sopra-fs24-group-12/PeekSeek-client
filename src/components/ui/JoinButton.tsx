import React from "react";
import { Button } from "@nextui-org/react";

const JoinButton: React.FC = () => {
  return (
    <Button
      radius="full"
      className="bg-gradient-to-tr from-blue-500 to-blue-200 text-black shadow-lg"
      onClick={() => {
        console.log("Submit action triggered");
        // Place your logic here
      }}
    >
      Join
    </Button>
  );
};

export default JoinButton;