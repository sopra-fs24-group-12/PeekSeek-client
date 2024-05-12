import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

interface CreateLoProps {
  onClick: () => void;
  isDisabled?: boolean;
}

const CreateLo: React.FC<CreateLoProps> = ({ onClick, isDisabled }) => {
  const navigate = useNavigate();
  const create = (): void => {
    navigate("/join");
  };

  return (
    <Button
      radius="full"
      size="lg"
      style={{
        filter: isDisabled ? "blur(0.1px)" : "",
        color: isDisabled ? "gray" : "black",
        fontFamily: "'Lato'",
        fontWeight: 400
      }}
      className={`w-[120px] mr-4 bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      Create
    </Button>
  );
};

export default CreateLo;
