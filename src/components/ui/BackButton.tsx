import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import BackIcon from "./BackIcon";

const BackButton: React.FC = () => {

  const navigate = useNavigate();

  return (
    <Button
      isIconOnly
      className="items-center bg-gradient-to-tr from-gray-400 to-gray-300 text-black shadow-lg"
      radius="full"
      size = "lg"
      color = "default"
      startContent={<BackIcon />}
      onClick={() => {
        console.log("Back Button clicked!");
        // Navigate to previous page, fallback to a landing if history is empty
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/landing");
        }
      }}
    >
    </Button>
  );
};

export default BackButton;