import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import BackIcon from "./BackIcon";

const BackDashboardButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      className="items-center bg-gradient-to-tr from-gray-400 to-gray-300 text-black shadow-lg"
      radius="full"
      style={{
        fontFamily: "'Lato'",
        fontWeight: 400,
      }}
      size = "lg"
      color = "default"
      startContent={<BackIcon />}
      onClick={() => {
        console.log("Back to Dashboard Button clicked!");
        localStorage.clear();
        navigate("/landing");
      }}
    >
      Dashboard
    </Button>
  );
};

export default BackDashboardButton;