import React from "react";
import { Button } from "@nextui-org/react";

interface click {
  onClick: () => void;
}

const BackButton: React.FC<click> = ({ onClick }) => {

  return (
    <Button
      className="items-center"
      radius="full"
      size="lg"
      color="default"
      onClick={onClick}
    >
      Back
    </Button>
  );
};

export default BackButton;