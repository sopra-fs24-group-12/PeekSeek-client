import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";

interface SaveButtonProps {
  lobbyId: string;
  quests: string[];
  cityName: string;
  admin: boolean;
}

const LobbySaveButton: React.FC<SaveButtonProps> = ({lobbyId, quests, cityName, admin}) => {
  const navigate = useNavigate();

  async function save() {
    if (!admin) {
      window.alert("Only the admin can save settings");
    } else {
      const headers = {
        "Authorization": localStorage.getItem("token")
      };
      const body = JSON.stringify({quests, cityName});
      const response = await api.put("/lobbies/" + lobbyId, body, { headers });
    }
  }


  return (
    <Button
      radius="full"
      size = "lg"
      color = "default"
      onClick={() => {
        console.log("Saving settings");
        save();
      }}
    >
      Save Settings
    </Button>
  );
};

export default LobbySaveButton;