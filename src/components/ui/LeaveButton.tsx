import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";

interface LeaveButtonProps {
  lobbyId: string;
}

const LeaveButton: React.FC<LeaveButtonProps> = ({lobbyId}) => {
  const navigate = useNavigate();

  async function leave() {
    const headers = {
      "Authorization": localStorage.getItem("token")
    };
    const response = await api.delete("/lobbies/" + lobbyId + "/leave/", { headers });
    localStorage.removeItem("token");
    navigate("/landing");
  }

  return (
    <Button
      radius="full"
      size = "lg"
      style={{
        fontFamily: "'Lato'",
        fontWeight: 400,
      }}
      color = "default"
      className="shadow-lg flex-start"
      onClick={() => {
        leave();
      }}
    >
      Leave Lobby
    </Button>
  );
};

export default LeaveButton;